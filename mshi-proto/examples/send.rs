use anyhow::{Result, Context};
use clap::{Parser};

use mshi_proto::*;

#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    /// Transmission format (only formats 2 and 6 are supported)
    #[arg(long)]
    fmt: u16,

    /// Address to send a message to (hexadecimal format)
    #[arg(long, value_parser = parse_hex_u16)]
    addr: u16,

    /// Subaddress to send a message to (hexadecimal format)
    #[arg(long, value_parser = parse_hex_u16, default_value = "1")]
    subaddr: u16,

    /// Command to send (hexadecimal format)
    #[arg(long, value_parser = parse_hex_u16)]
    command: u16,

    /// Send message via reserve bus
    #[arg(long)]
    reserve_bus: bool,

    /// Select device to use
    #[arg(long, default_value = "0")]
    device_num: usize,

    /// Select a base to use
    #[arg(long, default_value = "0")]
    base_num: u16,
}

fn main() -> Result<()> {
    {
        let tracing_sub = tracing_subscriber::fmt()
            .compact()
            .with_level(true)
            .with_target(false)
            .with_file(false)
            .with_line_number(false)
            .finish();

        tracing::subscriber::set_global_default(tracing_sub)
            .expect("Set global tracing subscriber");
    }

    let args = Args::parse();
    unsafe {
       match send(&args) {
           Ok(_) => tracing::info!("Message sent successfully!"),
           Err(err) => tracing::error!("{:?}", err),
       }

       // TODO: setup a signal handler and call tmk_done, tmk_close()
       tmk_done(args.device_num);
       tmk_close();
    }
    Ok(())

}

unsafe fn send(args: &Args) -> Result<()> {

    tracing::info!("Library init");
    match tmk_open() {
        res if res != 0 => anyhow::bail!("tmk_open() = {}", res),
        _ => {},
    }

    tracing::info!(num = args.device_num, "Select device");
    match tmk_config(args.device_num) {
        res if res != 0 => anyhow::bail!("tmk_config() = {}", res),
        _ => {},
    }

    tracing::info!("Set device into controller mode");
    match bcreset() {
        res if res != 0 => anyhow::bail!("bcreset() = {}", res),
        _ => {},
    }

    let (bus_name, bus_num) =
        if args.reserve_bus {
            ("RESERVE", 1)
        } else {
            ("PRIMARY", 0)
        };
    tracing::info!("Prepare {} bus for transmission", bus_name);
    match bcdefbus(bus_num) {
        res if res != 0 => anyhow::bail!("bcdefbus() = {}", res),
        _ => {},
    }

    tracing::info!("Use base {} for transmission", args.base_num);
    match bcdefbase(args.base_num) {
        res if res != 0 => anyhow::bail!("bcdefbase() = {}", res),
        _ => {},
    }

    let format = match args.fmt {
        6 => {
            bcputw(0, mk_recv_cmd(args.addr, args.subaddr, 0x11) as usize);
            bcputw(1, args.command as usize);

            0x04
        },
        2 =>  {
            bcputw(0, mk_transmit_cmd(args.addr, args.subaddr, 1) as usize);
            bcputw(1, args.command as usize);
            0x01
        },
        f => {
            anyhow::bail!("unsupported format => {}", f)
        }
    };

    tracing::info!("Start transmission");
    match bcstart(args.base_num, format) {
        res if res != 0 => anyhow::bail!("bcstart() = {}", res),
        _ => {},
    }

    tracing::info!("Waiting for events");
    for _ in 0..10 {
        match tmk_waitevents(1 << args.device_num, 200) {
            res if res == 0 => tracing::warn!("... no events"),
            res if res < 0 => anyhow::bail!("tmk_waitevents() = {}", res),
            _ => {},
        }
    }

    loop {
        let mut ev = TmkEventData::default();
        tmkgetevd(&mut ev);
        if ev.interrupt == 0 {
            break;
        }
        let int = ev.interrupt;
        tracing::info!(nInt = int, "event");
    }

    tracing::info!("Contents of the base {}", args.base_num);
    for i in 0..16 {
        let mut words = "".to_owned();
        for j in 0..4 {
            let word = bcgetw(i*4 + j);
            words.push_str(format!("{:#06x}", word).trim_start_matches("0x"));
            words.push_str(" ");
        }
        tracing::info!(words);
    }

    Ok(())
}

fn parse_hex_u16(s: &str) -> Result<u16>
{
    u16::from_str_radix(s, 16)
        .context("Parse hex number from string")
}

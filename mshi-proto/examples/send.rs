use anyhow::{Result, Context};
use clap::{Parser};

use mshi_proto::tmk_open;


#[derive(Parser, Debug)]
#[command(about, long_about = None)]
struct Args {
    /// Address to send a message to
    #[arg(long, value_parser = parse_hex_u16)]
    addr: u16,

    /// Sub-address
    #[arg(long, value_parser = parse_hex_u16)]
    sub_addr: u16,

    /// Message to send
    #[arg(long, value_parser = parse_hex_u16)]
    msg: u16,
}

fn main() -> Result<()> {
    let args = Args::parse();
    println!("{:?}", args);

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

    tracing::info!(args.msg, to = &args.addr, "Sending");
    unsafe { 
        let res = tmk_open();
        tracing::info!(res = res, "tmk_open");
    }
    tracing::info!(to = args.addr, "Connected");
    Ok(())
}

fn parse_hex_u16(s: &str) -> Result<u16>
{
    u16::from_str_radix(s, 16)
        .context("Parse hex number from string")
}

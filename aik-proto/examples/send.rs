use std::io;
use std::io::prelude::*;
use std::net::TcpStream;
use clap::Parser;

mod utils;

#[derive(Parser)]
#[command(about, long_about = None)]
struct Args {
    /// Address to send a message to
    addr: String,
    /// Message to send
    msg: String,
}

fn main() -> io::Result<()> {
    let args = Args::parse();

    utils::setup_tracing();

    tracing::info!(args.msg, to = &args.addr, "Sending");
    let mut stream = TcpStream::connect(&args.addr)?;
    tracing::info!(to = args.addr, "Connected");

    let len = stream.write("hello\r\n".as_bytes())?;
    tracing::info!(bytes = len, "Written");
    Ok(())
}

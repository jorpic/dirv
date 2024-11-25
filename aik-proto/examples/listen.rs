use std::io;
use std::net::TcpListener;
use clap::Parser;

mod utils;

#[derive(Parser)]
#[command(about, long_about = None)]
struct Args {
    /// A port to listen connections to
    port: u16,
}


fn main() -> io::Result<()> {
    let args = Args::parse();
    let addr = "0.0.0.0";

    utils::setup_tracing();

    tracing::info!(addr, port = args.port, "Listening");
    let listener = TcpListener::bind((addr, args.port))?;

    loop {
        match listener.accept() {
            Ok((_stream, addr)) => {
                tracing::info!(from = ?addr, "Got connection");
            }
            Err(e) => {
                tracing::error!("{e:?}");
            }
        }
    }
}

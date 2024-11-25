pub fn setup_tracing() {
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

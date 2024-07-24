extern crate cc;

fn main() {
    cc::Build::new()
        .file("vendor/ltmk.c")
        .define("_TMK1553B_LINUX", None)
        .define("_GNU_SOURCE", None) // Required to use CLONE_VM
        .compile("ltmk");
}

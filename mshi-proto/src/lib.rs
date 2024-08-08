
extern "C" {
    #[link_name = "TmkOpen"]
    pub fn tmk_open() -> isize;

    #[link_name = "TmkClose"]
    pub fn tmk_close();

    /// Free device's resources
    #[link_name = "tmkdone"]
    pub fn tmk_done(tmkNumber: usize) -> isize;

    #[link_name = "tmkconfig"]
    pub fn tmk_config(tmkNumber: usize) -> isize;

    /// Configure selected device as controller
    pub fn bcreset() -> isize;

    /// Select primary or reserve bus for transmission
    pub fn bcdefbus(bcBus: u16) -> isize;

    /// Select base for transmission
    pub fn bcdefbase(bcBasePC: u16) -> isize;

    /// Put a word into the selected base
    pub fn bcputw(bcAddr: usize, bcData: usize);

    /// Start transmission
    pub fn bcstart(bcBase: u16, bcCtrlCode: u16) -> isize;
}

pub fn mk_command(addr: u16, command: u16) -> u16 {
    let ci_mask = 0x03e0;
    (addr << 11) | ci_mask | (command & 0xf)
}



/*
 * TmkOpen(void) -> int
 * TmkClose()
 *
 * tmkconfig(tmkNumber: int) -> int
 *  - use tmkgetmaxn() to get number of available(?) devices
 * tmkdone(int tmkNumber) -> int
 *  - ALL_TMKS - to free all resources
 *
 * If you have single device, you don't need to use tmkselect to set current device, as
 * tmkconfig also sets device as currrent.
 *
 * Setting device mode:
 *  - bcreset - controller
 *  - rtreset - sensor
 *  - mtreset - bus monitor
 *
 * Set response timeout in microseconds:
 *  - tmktimeout
 *
 * tmkwaitevents(mask: int, wait_msec: int) -> mask
 * tmkgetevd(TTmkEventData*)
 *
 *
 * bcdefbase -- select base for transmission
 * bcputw / bcgetw
 *
 * CW(ADDR, DIR, SUBADDR, NWORDS)
 *
 * bcdefbus(BUS_A / BUS_B) -- major or reserve
 * bcstart(baseNum, format)
 *  - CTRL_CD_A = CC_FMT_6 = format 6
 *  - generates interrupt bcIntNorm or bcIntExc
 *
 * getansw(format) -> u32
 */

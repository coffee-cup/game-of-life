use std::ffi::CString;
use std::os::raw::c_char;

#[no_mangle]
pub fn add_one(number: i32) -> i32 {
    number + 1
}

#[no_mangle]
pub fn fact(i: u32) -> u64 {
    let mut n = i as u64;
    let mut result = 1;
    while n > 0 {
        result = result * n;
        n = n - 1;
    }
    result
}

#[no_mangle]
pub fn fact_str(n: u32) -> *mut c_char {
    let res = fact(n);
    let s = format!("{}", res);
    let s = CString::new(s).unwrap();
    s.into_raw()
}

export function validateAfterNext(values) {
    let errors = {};
    if (!values.email) {
        errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Email address is invalid';
    }
    if (!values.firstName) {
        errors.firstName = 'First Name is required';
    }
    if (!values.lastName) {
        errors.lastName = 'Last Name is required';
    }
    if (!values.password) {
        errors.password = 'Password is required';
    }
    if (!values.phoneNumber) {
        errors.phoneNumber = 'Phone Number is required';
    } else if (!isNumeric(values.phoneNumber)){
        errors.phoneNumber = 'Phone Number is Invalid';
    }

    console.log(errors)
    return errors;
};

export function validateBeforeNext(values) {
    let errors = {};
    if (!values.dobDay) {
        errors.dobDay = 'Day is required';
    }
    if (!values.dobMonth) {
        errors.dobMonth = 'Month is required';
    }
    if (!values.dobYear) {
        errors.dobYear = 'Year is required';
    }
    if (!values.dobHour) {
        errors.dobHour = 'Hour is required';
    }
    if (!values.dobMinute) {
        errors.dobMinute = 'Minute is required';
    }
    // if (!values.dobSecond) {
    //     errors.dobSecond = 'Second is required';
    // }
    if (!values.gender) {
        errors.gender = 'Gender is required';
    }
    if (!values.city) {
        errors.city = 'City is required';
    }
    if (!values.lat) {
        errors.lat = 'Latitude is required';
    }
    if (!values.lng) {
        errors.lng = 'Longitude is required';
    }
    // if (!values.astroSystem) {
    //     errors.astroSystem = 'Astro System is required';
    // }
    if (!values.language) {
        errors.language = 'Language is required';
    }
    if (!values.timezone) {
        errors.timezone = 'Timezone is required';
    }

    let dt = new Date(`${values.dobYear}/${values.dobMonth}/${values.dobDay}`)
    if (parseInt(values.dobDay) !== dt.getDate() || parseInt(values.dobMonth) !== (dt.getMonth() + 1) || parseInt(values.dobYear) !== dt.getFullYear()) {
        errors.dob = 'Invalid date entered';
    }
    console.log(errors)
    return errors;
};

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}
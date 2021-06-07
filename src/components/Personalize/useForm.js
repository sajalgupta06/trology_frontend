import { useState, useEffect } from 'react';
import { options } from './options';
import { useToasts } from 'react-toast-notifications'


const useForm = (callback, validateBeforeNext, validateAfterNext, setIsStepTwo) => {

    // set default language to english
    const [values, setValues] = useState({ lng: '', lat: '', city: '', language:'en', timezone: '5.5', dobSecond: '0' });
    const [beforeNextErrors, setBeforeNextErrors] = useState({});
    const [afterNextErrors, setAfterNextErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isNextClicked, setIsNextClicked] = useState(false);
    const { addToast } = useToasts()


    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        console.log("handleSubmit called")
        setIsSubmitting(true);
        setAfterNextErrors(validateAfterNext(values));
    };

    const handleNext = (event) => {
        if (event) event.preventDefault();
        console.log("handleNext called")
        setIsNextClicked(true);
        setBeforeNextErrors(validateBeforeNext(values));
    };

    const handleChange = (event) => {
        event.persist();
        let name = event.target.name
        let val = event.target.value
        if (name == 'phoneNumber') {
            val = val.replace('+91 ', '')
        }
        console.log('============before values', values)
        setValues({ ...values, [name]: val })
        console.log('============after values', values)
    };

    const handlePlace = (obj) => {
        console.log("handlePlace", obj)
        setValues({ ...values, ...obj })
    };

    useEffect(() => {
        if (isSubmitting) {
            if (Object.keys(afterNextErrors).length === 0) {
                console.log("no errors in generate horoscope")
                callback();
            } else {
                console.log("errors in generate horoscope")
                Object.keys(afterNextErrors).map(function (keyName, keyIndex) {
                    return (
                        addToast(afterNextErrors[keyName], {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    )
                })
                setIsSubmitting(false)
            }
        }
    }, [afterNextErrors, isSubmitting]);

    useEffect(() => {
        console.log('===============values are updated', values);
    }, [values]);

    useEffect(() => {
        if (isNextClicked) {
            if (Object.keys(beforeNextErrors).length === 0) {
                console.log("no errors in next: open basic details tab")
                setIsStepTwo(true)
            } else {
                console.log("errors in next")
                Object.keys(beforeNextErrors).map(function (keyName, keyIndex) {
                    return (
                        addToast(beforeNextErrors[keyName], {
                            appearance: 'error',
                            autoDismiss: true,
                        })
                    )
                })
                setIsNextClicked(false);
            }
        }

    }, [beforeNextErrors, isNextClicked]);

    return {
        handleChange,
        handleSubmit,
        handleNext,
        handlePlace,
        values,
        beforeNextErrors,
        afterNextErrors,
    }
};

export default useForm;

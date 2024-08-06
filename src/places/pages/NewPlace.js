import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input.js';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators.js';
import Button from '../../shared/components/FormElements/Button.js';
import { useForm } from '../../shared/hooks/form-hook.js';
import { useHttpClient } from '../../shared/hooks/http-hook.js';
import { AuthContext } from '../../shared/context/auth-context.js';
import ErrorModal from '../../shared/components/UIElements/ErrorModal.js';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner.js';
import ImageUpload from '../../shared/components/FormElements/ImageUpload.js';



const NewPlace = () => {
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false);

    const history = useHistory();


    const placeSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('title', formState.inputs.title.value);
            formData.append('description', formState.inputs.description.value);
            formData.append('address', formState.inputs.address.value);
            formData.append('image', formState.inputs.image.value);
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/places',
                'POST',
                formData,
                { Authorization: 'Bearer ' + auth.token }
            );
            //Redirect user to a different page.
            history.push('/');
        } catch (err) { }

    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            <form className='place-form' onSubmit={placeSubmitHandler}>
                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />

                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />

                <Input
                    id='address'
                    element='input'
                    label='Address'
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                />

                <ImageUpload
                    center
                    id="image"
                    onInput={inputHandler}
                    errorText='Please provide an image.' />

                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>

            </form>
        </React.Fragment>
    );
}

export default NewPlace;
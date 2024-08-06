import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import { useHttpClient } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);

                setLoadedPlaces(responseData.places);


            } catch (err) {
                setLoadedPlaces([]);
            }
        }
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeletedHandler = (deletedPlaceId) => {
        setLoadedPlaces(loadedPlaces.filter(place => place.id !== deletedPlaceId));
    };

    return (
        <React.Fragment>
            {userId !== auth.userId &&
                (<ErrorModal error={error} onClear={clearError} />)}
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />}
        </React.Fragment>
    );
};

export default UserPlaces;
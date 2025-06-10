// src/hooks/useEventDetails.js
import { useState, useEffect } from 'react';
import { eventService, registrationService } from '../services/api';
import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';

export const useEventDetails = (eventId) => {
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCurrentlyRegistered, setIsCurrentlyRegistered] = useState(false);
    const { user, isAuthenticated, userRoles } = useAuth();

    useEffect(() => {
        if (!eventId) {
            setError("Không tìm thấy ID sự kiện.");
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            setEvent(null);
            setIsCurrentlyRegistered(false);

            try {
                // 1. Fetch event data
                const response = await eventService.getEvent(eventId);
                const eventData = response.data;
                setEvent(eventData);

                // 2. Check registration status if user is a logged-in student
                if (isAuthenticated && userRoles.includes(ROLES.STUDENT) && user?.id && eventData?.eventId) {
                    const registeredEvents = await registrationService.getEventsUserRegisteredFor(user.id);
                    if (Array.isArray(registeredEvents) && registeredEvents.some(reg => (reg.event?.eventId || reg.eventId) === eventData.eventId)) {
                        setIsCurrentlyRegistered(true);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Không thể tải thông tin sự kiện.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [eventId, isAuthenticated, user?.id, userRoles]);

    return { event, isLoading, error, isCurrentlyRegistered, setIsCurrentlyRegistered };
};
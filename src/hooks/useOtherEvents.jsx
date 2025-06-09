// src/hooks/useOtherEvents.js
import { useState, useEffect } from 'react';
import { eventService } from '../services/api';

export const useOtherEvents = (currentEventId) => {
    const [otherEvents, setOtherEvents] = useState([]);
    const [loadingOtherEvents, setLoadingOtherEvents] = useState(true);

    useEffect(() => {
        if (!currentEventId) return;

        const fetchOthers = async () => {
            setLoadingOtherEvents(true);
            try {
                const allEventsResponse = await eventService.getAllEvents();
                const allEventsData = Array.isArray(allEventsResponse) ? allEventsResponse : [];
                
                if (allEventsData.length > 0) {
                    const filtered = allEventsData
                        .filter(e => String(e.eventId) !== String(currentEventId))
                        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
                        .slice(0, 10); // Fetch 10 other events
                    setOtherEvents(filtered);
                }
            } catch (err) {
                console.error("Error fetching other events:", err);
                setOtherEvents([]);
            } finally {
                setLoadingOtherEvents(false);
            }
        };

        fetchOthers();
    }, [currentEventId]);

    return { otherEvents, loadingOtherEvents };
};
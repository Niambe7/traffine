import api from "./api";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface StepDTO {
  distance: { value: number; text: string };
  duration: { value: number; text: string };
  html_instructions: string;
  polyline: { points: string };
  maneuver?: string;
}

/**
 * Ce type correspond aux options renvoyées par /itineraries/search
 */
export interface ItineraryOptionDTO {
  id: number;
  distance: number;
  duration: number;
  toll_free: boolean;
  route_points: LatLng[];     // pour affichage
  steps: StepDTO[];           // instructions
  encoded_polyline: string;   // ← NOUVEAU
}

/**
 * Ce type correspond à l'itinéraire sauvegardé en base
 */
export interface ItineraryDTO {
  id: number;
  user_id: number;
  start_location: string;
  end_location: string;
  distance: number;
  duration: number;
  toll_free: boolean;
  route_points: LatLng[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Appelle POST /itineraries/search
 * et retourne l’array d’options (au moins 2).
 */
export interface ItineraryOptionDTO {
  id: number;
  distance: number;
  duration: number;
  toll_free: boolean;
  route_points: LatLng[];     // pour affichage
  steps: StepDTO[];           // instructions
  encoded_polyline: string;   // ← NOUVEAU
}

export const fetchItineraries = async (
  start: string,
  end: string,
  avoidTolls: boolean
): Promise<ItineraryOptionDTO[]> => {
  const res = await api.post("/itineraries/itineraries/search", { start_location: start, end_location: end, avoidTolls });
  return (res.data.itineraries ?? []).map((opt: ItineraryOptionDTO) => ({
    id:              opt.id,
    distance:        opt.distance,
    duration:        opt.duration,
    toll_free:       opt.toll_free,
    route_points:    opt.route_points,       
    steps:           opt.steps,
    encoded_polyline: opt.encoded_polyline 
  }));
};



/**
 * Enregistre l'itinéraire sélectionné en base
 * Envoie les steps et les route_points pour qu'ils soient persistés
 */
export const loadItinerary = async (
  userId: number,
  choice: ItineraryOptionDTO,
  start: string,
  end: string
): Promise<ItineraryDTO> => {
  const body = {
    user_id: userId,
    start_location: start,
    end_location: end,
    selected_itinerary: {
      distance: choice.distance,
      duration: choice.duration,
      toll_free: choice.toll_free,
      steps: choice.steps,
      route_points: choice.route_points,
    },
  };

  const res = await api.post("/itineraries/itineraries/load", body);
  return res.data.itinerary as ItineraryDTO;
};

/**
 * Récupère un itinéraire complet par son ID
 */
export const getItineraryById = async (
  itineraryId: number
): Promise<ItineraryDTO> => {
  // On appelle GET sur /itineraries/itineraries/{id}
  const res = await api.get("/itineraries/itineraries/" + itineraryId);
  if (!res.data.itinerary) {
    throw new Error(`Itinéraire ${itineraryId} non trouvé`);
  }
  return res.data.itinerary as ItineraryDTO;
};

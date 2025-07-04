//Supabase:
type DriverInfo = {
  rating?: number;
  car?: {
    model: string;
    plate: string;
  };
};

type UserRole = 
  | { type: 'driver'; data: DriverInfo }
  | { type: 'passenger' };

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  access_token: string;
  refresh_token: string;
}


//Api:
    //Usuario ?
    // — — 
    interface rideHistoric
{
    id: string //ride id',
      origin: {
        name,
        latitude,
        longitude
      },
      distanation: {
        name,
        latitude,
        longitude
      },
      duration: number,
      distance: number,
      datetime: string,
      price: number,
      status: "done" | "canceled",
}



Corrida

Lugares prochinmos por categoria

Drivers disponíveis 
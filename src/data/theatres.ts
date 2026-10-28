export const CITY_COORDINATES: Record<string, [number, number]> = {
  Indore: [22.72, 75.86],
  Mumbai: [19.08, 72.88],
  Delhi: [28.61, 77.21],
  Bengaluru: [12.97, 77.59],
  Hyderabad: [17.39, 78.49],
  Chennai: [13.08, 80.27],
  Kolkata: [22.57, 88.36],
  Pune: [18.52, 73.86],
  Jaipur: [26.91, 75.79],
};

export const THEATRES: Record<string, [string, string][]> = {
  Indore: [
    ['Fundore Cinemas', 'Rau Bypass'],
    ['PVR Treasure Island Mall', 'South Tukoganj'],
    ['INOX C-21 Mall', 'Sheetal Nagar'],
    ['INOX Phoenix Citadel Mall', 'MR 10 Road'],
    ['INOX Nexus Indore Central', 'Regal Square'],
    ['Drama Factory Cinema', 'Zodiac Mall'],
    ['Miraj Cinemas Velocity', 'Ring Road'],
    ['Rajhans Cinemas', 'Malhar Mega Mall'],
    ['Mangal Multiplex', 'Vijay Nagar'],
    ['Cine Square Cinemas', 'Tirupati Nagar'],
    ['Aastha Cinema', 'Nanda Nagar'],
    ['Kalyan Cinemas', 'Rajendra Nagar']
  ],
  Mumbai: [
    ['PVR Icon', 'Infiniti Mall, Andheri W'],
    ['PVR Jio World Drive', 'BKC'],
    ['INOX', 'Nariman Point'],
    ['Liberty Cinema', 'Marine Lines'],
    ['Gaiety Galaxy', 'Bandra'],
    ['Regal Cinema', 'Colaba']
  ],
  Delhi: [
    ['PVR Priya', 'Vasant Vihar'],
    ['PVR Select Citywalk', 'Saket'],
    ['PVR Director\'s Cut', 'Ambience Mall, Vasant Kunj'],
    ['Delite Cinema', 'Asaf Ali Road'],
    ['Cinepolis', 'DLF Place, Saket']
  ],
  Bengaluru: [
    ['PVR Forum Mall', 'Koramangala'],
    ['INOX Garuda Mall', 'Magrath Road'],
    ['PVR Orion Mall', 'Rajajinagar'],
    ['Cinepolis Royal Meenakshi Mall', 'Bannerghatta Road']
  ],
  Hyderabad: [
    ['Prasads Multiplex (IMAX)', 'Necklace Road'],
    ['AMB Cinemas', 'Gachibowli'],
    ['INOX GVK One', 'Banjara Hills'],
    ['PVR Next Galleria', 'Panjagutta']
  ],
  Chennai: [
    ['Sathyam Cinemas', 'Royapettah'],
    ['Kasi Theatre', 'Ashok Nagar'],
    ['Rohini Silver Screens', 'Koyambedu'],
    ['AGS Cinemas', 'OMR']
  ],
  Kolkata: [
    ['INOX Quest Mall', 'Park Circus'],
    ['Priya Cinema', 'Hazra'],
    ['Nandan', 'Rabindra Sadan']
  ],
  Pune: [
    ['INOX', 'Bund Garden Road'],
    ['PVR Pavilion Mall', 'Shivajinagar'],
    ['E-Square', 'University Road'],
    ['City Pride', 'Kothrud']
  ],
  Jaipur: [
    ['Raj Mandir', 'Bhagwan Das Road'],
    ['INOX Crystal Palm', 'Sahkar Circle'],
    ['PVR World Trade Park', 'Malviya Nagar']
  ]
};

export const BASE_SLOTS: [string, string, number][] = [
  ["10:30 AM", "PVR Cinemas", 180],
  ["01:45 PM", "Cinepolis", 240],
  ["05:15 PM", "Carnival Cinemas", 320],
  ["08:40 PM", "Miraj Cinemas", 320],
  ["11:00 PM", "Classic Screen", 180]
];

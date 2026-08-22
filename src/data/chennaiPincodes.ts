import { ChennaiPinLocation } from '../types';

export const CHENNAI_PINCODES: Record<string, ChennaiPinLocation> = {
  // Central Chennai
  '600001': { pincode: '600001', locality: 'George Town / Broadway', isDeliverable: true, zone: 'North Chennai', deliveryFee: 40, estimatedTime: 'Within 2 hours' },
  '600002': { pincode: '600002', locality: 'Mount Road / Anna Salai', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 90 mins' },
  '600003': { pincode: '600003', locality: 'Park Town / Central Station', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 35, estimatedTime: 'Within 90 mins' },
  '600004': { pincode: '600004', locality: 'Mylapore / Santhome / Mandaveli', isDeliverable: true, zone: 'South Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600005': { pincode: '600005', locality: 'Triplicane / Chepauk', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 75 mins' },
  '600006': { pincode: '600006', locality: 'Gopalapuram / Thousand Lights', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 25, estimatedTime: 'Within 60 mins' },
  '600007': { pincode: '600007', locality: 'Vepery / Choolai', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 35, estimatedTime: 'Within 90 mins' },
  '600008': { pincode: '600008', locality: 'Egmore / Pantheon Road', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 75 mins' },
  '600010': { pincode: '600010', locality: 'Kilpauk / Kellys', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 75 mins' },
  '600014': { pincode: '600014', locality: 'Royapettah / Express Avenue Area', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 25, estimatedTime: 'Within 60 mins' },
  '600017': { pincode: '600017', locality: 'T. Nagar / Pondy Bazaar', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 25, estimatedTime: 'Within 45 mins (Bakery Hub)' },
  '600018': { pincode: '600018', locality: 'Alwarpet / Teynampet', isDeliverable: true, zone: 'South Chennai', deliveryFee: 25, estimatedTime: 'Within 45 mins' },
  '600020': { pincode: '600020', locality: 'Adyar / Gandhinagar / Besant Nagar', isDeliverable: true, zone: 'South Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600024': { pincode: '600024', locality: 'Kodambakkam / Trustpuram', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600028': { pincode: '600028', locality: 'R.A. Puram / MRC Nagar', isDeliverable: true, zone: 'South Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600034': { pincode: '600034', locality: 'Nungambakkam / Sterling Road', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 25, estimatedTime: 'Within 60 mins' },
  '600040': { pincode: '600040', locality: 'Anna Nagar West / Shanthi Colony', isDeliverable: true, zone: 'West Chennai', deliveryFee: 35, estimatedTime: 'Within 75 mins' },
  '600041': { pincode: '600041', locality: 'Thiruvanmiyur / Valmiki Nagar', isDeliverable: true, zone: 'South Chennai', deliveryFee: 35, estimatedTime: 'Within 75 mins' },
  '600042': { pincode: '600042', locality: 'Velachery / Vijaya Nagar', isDeliverable: true, zone: 'South Chennai', deliveryFee: 35, estimatedTime: 'Within 75 mins' },
  '600078': { pincode: '600078', locality: 'K.K. Nagar / Ashok Nagar', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600083': { pincode: '600083', locality: 'Ashok Nagar / Vadapalani', isDeliverable: true, zone: 'Central Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600096': { pincode: '600096', locality: 'Perungudi / Kandanchavadi (OMR)', isDeliverable: true, zone: 'OMR/ECR Corridor', deliveryFee: 40, estimatedTime: 'Within 90 mins' },
  '600097': { pincode: '600097', locality: 'Thoraipakkam / OMR Tech Corridor', isDeliverable: true, zone: 'OMR/ECR Corridor', deliveryFee: 40, estimatedTime: 'Within 90 mins' },
  '600100': { pincode: '600100', locality: 'Medavakkam / Pallikaranai', isDeliverable: true, zone: 'South Chennai', deliveryFee: 45, estimatedTime: 'Within 90 mins' },
  '600102': { pincode: '600102', locality: 'Anna Nagar East / Shenoy Nagar', isDeliverable: true, zone: 'West Chennai', deliveryFee: 35, estimatedTime: 'Within 75 mins' },
  '600116': { pincode: '600116', locality: 'Porur / Mugalivakkam / Ramapuram', isDeliverable: true, zone: 'West Chennai', deliveryFee: 40, estimatedTime: 'Within 90 mins' },
  '600119': { pincode: '600119', locality: 'Sholinganallur / Karapakkam (OMR)', isDeliverable: true, zone: 'OMR/ECR Corridor', deliveryFee: 45, estimatedTime: 'Within 90 mins' },
  '600045': { pincode: '600045', locality: 'Tambaram / Chromepet / Sanatorium', isDeliverable: true, zone: 'South Chennai', deliveryFee: 50, estimatedTime: 'Within 2 hours' },
  '600032': { pincode: '600032', locality: 'Guindy / Ekkatuthangal / Kathipara', isDeliverable: true, zone: 'South Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' },
  '600090': { pincode: '600090', locality: 'Besant Nagar / Elliot Beach Road', isDeliverable: true, zone: 'South Chennai', deliveryFee: 30, estimatedTime: 'Within 60 mins' }
};

export function checkChennaiPincode(pincode: string): {
  isDeliverable: boolean;
  location?: ChennaiPinLocation;
  message: string;
} {
  const cleanPin = pincode.trim();
  
  if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
    return {
      isDeliverable: false,
      message: 'Please enter a valid 6-digit Indian PIN code.'
    };
  }

  // Check if PIN code starts with 600 (Chennai postal zone)
  if (!cleanPin.startsWith('600')) {
    return {
      isDeliverable: false,
      message: `PIN ${cleanPin} is outside Chennai city. We currently bake and deliver exclusively across Chennai.`
    };
  }

  const location = CHENNAI_PINCODES[cleanPin];
  if (location) {
    return {
      isDeliverable: location.isDeliverable,
      location,
      message: `Great news! We deliver fresh to ${location.locality} (${cleanPin}) in ${location.estimatedTime}.`
    };
  }

  // If it's a valid 600xxx PIN not explicitly mapped
  const pinNum = parseInt(cleanPin, 10);
  if (pinNum >= 600001 && pinNum <= 600130) {
    return {
      isDeliverable: true,
      location: {
        pincode: cleanPin,
        locality: `Chennai Greater Zone (PIN ${cleanPin})`,
        isDeliverable: true,
        zone: 'Central Chennai',
        deliveryFee: 40,
        estimatedTime: 'Within 2 to 3 hours'
      },
      message: `Delivery is available to Chennai PIN ${cleanPin}! Fresh delivery within 2 to 3 hours.`
    };
  }

  return {
    isDeliverable: false,
    message: `Delivery is currently not available for PIN ${cleanPin}. Only within Chennai metropolitan area (600001-600130).`
  };
}

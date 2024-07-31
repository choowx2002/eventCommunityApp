export const getLocationAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const json = await response.json();
      console.log(json);
      console.log("address state: " + json.address.city+", "+json.address.state)
    } catch (error) {
      console.error(error);
    }
  };
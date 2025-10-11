const baseURL = import.meta.env.VITE_SERVER_URL;


function convertToJson(res) {
  const resJson = res.json();
  if (res.ok) {
    return resJson;
  } else {
    throw { name: "servicesError", message: resJson };
  }
}

export default class ExternalServices {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  // constructor() {
  // }
  // async getData(category) {
  //   const response = await fetch(`${baseURL}products/search/${category} `);
  //   const data = await convertToJson(response);
  //   return data.Result;
  // }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}


export async function searchByCategoty(category){
    try{
        let response = await fetch(`${baseURL}products/search/${category}`);
        
        if (!response.ok){
            throw new Error(`Resquest error: ${response.status}`)
        }

        let data = await response.json();
        // console.log(data);

        return data.Result;
    } catch(error){
        return null;
    }
};

export async function searchById(productId, data) {
  try{
    // // eslint-disable-next-line no-console
    // console.log(data);
    let product = data.filter(p => p.Id == productId);
    return product[0];
  } catch(error){
      // console.error("Error");
      return null;
  }
};


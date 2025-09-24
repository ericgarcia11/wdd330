const baseURL = import.meta.env.VITE_SERVER_URL;


function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `../json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }
}


export async function searchByCategoty(category){
    try{
        let response = await fetch(`${baseURL}products/search/${category}`);
        
        if (!response.ok){
            throw new Error(`Resquest error: ${response.status}`)
        }

        let data = await response.json();
        console.log(data);

        return data.Result;
    } catch(error){
        console.error("Error");
    }
};

export async function searchById(productId) {
  try{
    let response = await fetch(`${baseURL}product/${productId}`);
        
    if (!response.ok){
      throw new Error(`Resquest error: ${response.status}`)
    }

    let data = await response.json();
      console.log(data);

      return data.Result;
  } catch(error){
      console.error("Error");
  }
};

//${baseURL}product/${id}
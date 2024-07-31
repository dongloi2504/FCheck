import axios from './customize-axios'; 

const Test = {
  checkPlagiarism: async (text) => {
    try {
      const response = await axios.post(`/check`, { text });
      return response;
    } catch (error) {
      throw error; 
    }
  }
}

export default Test;
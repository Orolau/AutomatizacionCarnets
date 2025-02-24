const Person = require("../models/person.js");
const { uploadToPinata } = require("../utils/pinata"); 

// Obtener todas las personas
const getPeople = async (req, res) => {
    try {
        const people = await Person.find();
        res.json(people);
    } catch (error) {
        res.status(500).json({ message: "Error obteniendo los datos" });
    }
};

// Obtener personas con filtros
const getFilteredPersons = async (req, res) => {
    try {
        const filters = req.query; // Obtener los filtros de los query params
        const filteredPersons = await Person.find(filters); // Usar los filtros directamente en la consulta
        res.json(filteredPersons); // Devolver las personas filtradas
    } catch (error) {
        res.status(500).json({ message: "Error en la obtención de las personas filtradas", error });
    }
};


// Crear una nueva persona
const createPerson = async (req, res) => {
    const {body} = req;
    const data = await Person.create(body);
    res.json(data)
};

// Obtener una persona por id
const getPersonById = async (req, res) => {
    const {id} = req.params;
    const data = await Person.findOne({"_id": id})
    res.json(data);
};
// Obtener una persona por dni
const getPersonByDNI = async (req, res) => {
    const {dni} = req.params;
    const data = await Person.findOne({"dni": dni})
    res.json(data);
};
// Obtener una persona por dni
const getPersonByName = async (req, res) => {
    try {
        const { nombreCompleto } = req.params;

        // Separar en nombre y apellidos
        const [nombre, ...apellidosArray] = nombreCompleto.split(" ");
        const apellidos = apellidosArray.join(" ");

        const data = await Person.findOne({ nombre, apellidos });

        if (!data) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error en getPersonByName:", error.message);
        res.status(500).json({ error: "Error al obtener la persona" });
    }
};

// Actualizar persona por id
const updatePerson = async (req, res) => {
    const { id } = req.params;
  
    // Asegúrate de que 'id' no sea undefined
    if (!id) {
      return res.status(400).json({ error: "ID es requerido" });
    }
  
    try {
      const updatedPerson = await Person.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedPerson) {
        return res.status(404).json({ error: "Persona no encontrada" });
      }
  
      res.json(updatedPerson);  // Responde con los datos actualizados
    } catch (error) {
      console.error("Error al actualizar la persona:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  

// Eliminar persona por id
const deletePerson = async (req, res) => {
    const {id} = req.params;
    const data = await Person.findByIdAndDelete(id);
    res.json(data)
};

const updatePersonPhoto = async (req, res) => {
    try {
        const { id } = req.params;  // Se recibe el ID de la persona
        const { foto } = req.body;   // La nueva URL de la foto viene en el body

        if (!foto) {
            return res.status(400).json({ message: "El campo 'foto' es obligatorio" });
        }

        // Buscar y actualizar solo el campo 'foto'
        const updatedPerson = await Person.findOneAndUpdate(
            { _id: id }, // Usamos el _id aquí, ya que estamos buscando por el ID de MongoDB
            { $set: { foto } }, 
            { new: true } // Para devolver el documento actualizado
        );

        if (!updatedPerson) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json({ message: "Foto actualizada exitosamente", updatedPerson });
    } catch (error) {
        console.error("Error en updatePersonPhoto:", error.message);
        res.status(500).json({ error: "Error al actualizar la foto" });
    }
};


const uploadImageAndUpdatePerson = async (req, res) => {
    try {
        const { id } = req.params; // Asegúrate de que id existe y es correcto
        if (!req.file) {
            return res.status(400).json({ message: "No se ha proporcionado ninguna imagen." });
        }

        // Subir imagen a Pinata
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);

        if (!pinataResponse.IpfsHash) {
            throw new Error("No se pudo obtener el hash de la imagen en Pinata.");
        }

        // Construir URL de la imagen en IPFS
        const imageUrl = `https://${process.env.PINATA_GATEWAY}/ipfs/${pinataResponse.IpfsHash}`;

        // Actualizar el campo "foto" en MongoDB
        const updatedPerson = await Person.findByIdAndUpdate(
            id,
            { $set: { foto: imageUrl } },
            { new: true }
        );

        if (!updatedPerson) {
            return res.status(404).json({ message: "Persona no encontrada." });
        }

        res.json({ message: "Foto actualizada correctamente", updatedPerson });
    } catch (error) {
        console.error("Error al subir la imagen y actualizar la persona:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};



module.exports = {
    getPeople,
    getFilteredPersons,
    createPerson,
    getPersonById,
    updatePerson,
    deletePerson,
    getPersonByDNI,
    getPersonByName,
    updatePersonPhoto,
    uploadImageAndUpdatePerson 
};

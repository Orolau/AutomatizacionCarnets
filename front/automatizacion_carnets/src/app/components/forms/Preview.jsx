import { useState } from "react";
import '@/app/styles/Preview.css';

const Preview = () => {
    const [people] = useState([
        { name: "Jose Manuel Garcia", photo: "foto-carnet 1" },
        { name: "Manuel Regano", photo: "foto-carnet 2" },
        { name: "Alicia Mepa", photo: "foto-carnet 3" },
        { name: "Bob Granie", photo: "foto-carnet 4" },
        { name: "Carlos Ramirez", photo: "foto-carnet 5" },
        { name: "Dana Ramirez", photo: "foto-carnet 6" },
        { name: "Elena Juarez", photo: "foto-carnet 7" },
        { name: "Frank Castillo", photo: "foto-carnet 8" },
        { name: "Gracia Perez", photo: "foto-carnet 9" },
        { name: "Paulo Gomes", photo: "foto-carnet 10" },
    ]);

    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleOpenPopup = (person) => {
        setSelectedPerson(person);
    };

    const handleClosePopup = () => {
        setSelectedPerson(null);
    };

    return (
        <>
            {/* Título Grande */}
            <h2 className="preview-title">Preview de los carnets creados</h2>

            {/* Contenedor Principal */}
            <div className="preview-container">
                <div className="people-grid">
                    {people.map((person, index) => (
                        <div
                            key={index}
                            className="person-card"
                            onClick={() => handleOpenPopup(person)}
                        >
                            <h3>{person.name}</h3>
                            <img src={person.photo} alt={person.name} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Popup Modal */}
            {selectedPerson && (
                <div className="popup-overlay" onClick={handleClosePopup}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={handleClosePopup}>&times;</span>
                        <h2>{selectedPerson.name}</h2>
                        <img src={selectedPerson.photo} alt={selectedPerson.name} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Preview;

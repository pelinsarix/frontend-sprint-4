import { useState } from "react";
import ToolBar from "./ToolBar.jsx";

const Accordion = ({ sections }) => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (index) => {
        setOpenSection((prevIndex) => (prevIndex === index ? null : index));
    };

    return (
        <ToolBar>
            {sections.map((section, index) => (
                <div key={index}>
                    <div
                        tabIndex={0}
                        className="accordion-header"
                        onClick={() => toggleSection(index)}
                    >
                        {section.title}
                        <span>{openSection === index ? "-" : "+"}</span>
                    </div>
                    <div className={`accordion-content ${openSection === index ? "open" : ""}`} >
                        {section.items.map((item, idx) => (
                            <div
                                title='Arraste para adicionar ao exercício'
                                key={idx}
                                className="itemTool"
                                draggable
                                onDragStart={(event) => item.onDragStart(event, item.id)}
                            >
                                {item.icon}
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </ToolBar>
    );
};

export default Accordion;
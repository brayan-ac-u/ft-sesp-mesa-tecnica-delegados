import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { FaFile, FaFileImage, FaFileWord } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import { descargarAnexo } from "../../services/download";
import "../../styles/modal.css";

interface Anexo {
    nombre_archivo: string;
    tipo: string;
    id: string;
}

const anexos: Anexo[] = [
    { nombre_archivo: "Documento1.pdf", tipo: "pdf", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Imagen1.jpg", tipo: "jpg", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Informe1.docx", tipo: "docx", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Notas1.txt", tipo: "text", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Documento2.pdf", tipo: "pdf", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Imagen2.jpg", tipo: "jpg", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Informe2.docx", tipo: "docx", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Notas.2txt", tipo: "text", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" },
    { nombre_archivo: "Documento3.pdf", tipo: "pdf", id: "f78a1671-f8bb-4cdf-b2a6-fbadf7a7e13c" }
];

const getIconByType = (tipo: string) => {
    switch (tipo) {
        case "pdf":
            return <BsFillFileEarmarkPdfFill />;
        case "jpg":
            return <FaFileImage />;
        case "docx":
            return <FaFileWord />;
        default:
            return <FaFile />;
    }
};

export const Anexos: React.FC<any> = ({ row }) => {
    const [, setHoverIndex] = useState<number | null>(null);

    const handleDownload = (id: string, nombreArchivo: string) => {
        descargarAnexo(id, nombreArchivo);
    };

    const {
        primerNombreEvaluado,
        segundoNombreEvaluado = "",
        primerApellidoEvaluado,
        segundoApellidoEvaluado = ""
    } = row;

    const nombreCompleto = [primerNombreEvaluado, segundoNombreEvaluado, primerApellidoEvaluado, segundoApellidoEvaluado]
        .filter(Boolean)
        .join(" ");

    return (
        <div>
            <div className="unp-row-subtitle">
                <div className="modal_subtitle_container">
                    <div className="red-section"></div>
                    <FaUser />
                    <span className="modal-subtitle">{nombreCompleto}</span>
                </div>
                <div>
                    <span className="modal-subtitle-two">{row.ot}</span>
                </div>
            </div>
            <div className="files_container">
                {anexos.map((anexo, index) => (
                    <div
                        key={index}
                        className="anexo_item"
                        onClick={() => handleDownload(anexo.id, anexo.nombre_archivo)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <div className="file_icon_container">
                            {getIconByType(anexo.tipo)}
                        </div>
                        <span>{anexo.nombre_archivo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

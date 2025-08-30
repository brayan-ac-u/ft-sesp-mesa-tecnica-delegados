export const descargarAnexo = async (id: string, nombreArchivo: string) => {
    const url = `https://backend.com/api/download/${id}`; 

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer token_unp', 
            },
        });

        if (!response.ok) {
            throw new Error("Error en la descarga del archivo");
        }

        const blob = await response.blob();
        const urlBlob = window.URL.createObjectURL(blob);

        const enlace = document.createElement('a');
        enlace.href = urlBlob;
        enlace.download = nombreArchivo;
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();

        window.URL.revokeObjectURL(urlBlob);
        
    } catch (error) {
        console.error("Error en la descarga del archivo:", error);
    }
};


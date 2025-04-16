const express = require('express');
const fs = require('fs');
const multer = require('multer');
const { encrypt, decrypt } = require('./aes');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

// Página de inicio
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Cifrar
app.post('/encrypt', (req, res) => {
    const { message, key } = req.body;
    if (key.length !== 16) return res.status(400).send('La clave debe tener 16 caracteres');

    const encrypted = encrypt(message, key);
    const filename = `encrypted_${Date.now()}.txt`;

    fs.writeFileSync(`uploads/${filename}`, encrypted);
    res.download(`uploads/${filename}`, filename);
});

// Descifrar
app.post('/decrypt', upload.single('file'), (req, res) => {
    const { key } = req.body;
    if (key.length !== 16) return res.status(400).send('La clave debe tener 16 caracteres');

    const encryptedText = fs.readFileSync(req.file.path, 'utf8');
    try {
        const decrypted = decrypt(encryptedText, key);
        res.send(decrypted);
    } catch (e) {
        res.status(400).send('Clave incorrecta o archivo inválido');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

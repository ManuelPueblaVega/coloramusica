let video;
let capture;
let noteColor;
let volumeColor;
let isPlaying = false;
let synth;
let scale = 'major';
let tonality = 'C';
let midiOutput;

function setup() {
    const canvas = createCanvas(320, 240);
    canvas.parent('video-container');
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    synth = new Tone.Synth().toDestination();

    document.getElementById('startButton').addEventListener('click', startPlaying);
    document.getElementById('stopButton').addEventListener('click', stopPlaying);
    document.getElementById('scale').addEventListener('change', (event) => {
        scale = event.target.value;
    });
    document.getElementById('tonality').addEventListener('change', (event) => {
        tonality = event.target.value;
    });

    WebMidi.enable()
        .then(() => {
            midiOutput = WebMidi.outputs[0];
            console.log('MIDI Output:', midiOutput);
        })
        .catch((err) => {
            console.error('Error al habilitar WebMidi:', err);
        });

    calibrateColors();
}

function draw() {
    if (isPlaying) {
        image(video, 0, 0, width, height);
        const pixelColor = video.get(mouseX, mouseY);
        const note = mapColorToNote(pixelColor, noteColor, scale, tonality);
        const volume = mapColorToVolume(pixelColor, volumeColor);
        const midiNote = Tone.Frequency(note).toMidi();
        const velocity = map(volume, -40, 0, 0, 127);
        midiOutput.playNote(midiNote, 1, { velocity });
        synth.triggerAttackRelease(note, '8n', Tone.now(), volume);
    }
}

function startPlaying() {
    isPlaying = true;
}

function stopPlaying() {
    isPlaying = false;
}

function calibrateColors() {
    // Aquí puedes implementar la lógica para calibrar los colores
    // Por ejemplo, mostrar un mensaje para que el usuario muestre un color y capturarlo
    noteColor = color(255, 0, 0); // Rojo para notas (ejemplo)
    volumeColor = color(0, 255, 0); // Verde para volumen (ejemplo)
}

function mapColorToNote(color, baseColor, scale, tonality) {
    // Implementa la lógica para mapear el color a una nota musical
    // Esto es un ejemplo simplificado
    const distance = dist(color.levels[0], color.levels[1], color.levels[2], baseColor.levels[0], baseColor.levels[1], baseColor.levels[2]);
    const note = tonality + str(int(map(distance, 0, 255, 0, 7)));
    return note;
}

function mapColorToVolume(color, baseColor) {
    // Implementa la lógica para mapear el color al volumen
    // Esto es un ejemplo simplificado
    const distance = dist(color.levels[0], color.levels[1], color.levels[2], baseColor.levels[0], baseColor.levels[1], baseColor.levels[2]);
    const volume = map(distance, 0, 255, -40, 0); // Volumen en decibelios
    return volume;
}

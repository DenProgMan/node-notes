const fs = require('fs');

const [command, title, content] = process.argv.slice(2);
const fileName = 'notes.json';

const writeToFile = (data) => {
    const json = JSON.stringify(data);
    fs.writeFile(fileName, json, (error) => {
        if (error) {
            return { success: false, error };
        }

        return { success: true };
    });
};

function create(noteTitle, noteContent) {
    const newNote = { title: noteTitle, content: noteContent };

    fs.access(fileName, fs.constants.F_OK, (err) => {
        if (err) {
            writeToFile([newNote]);
            return { success: true };
        }

        fs.readFile(fileName, (err, data) => {
            if (err) {
                return { success: false, error: err };
            }

            const notes = JSON.parse(data);
            notes.push(newNote);
            writeToFile(notes);
        });
    });
}

function list() {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return { success: false, error: err };
        }

        const notes = JSON.parse(data);
        notes.forEach((value, index) => {
            console.log(`${index + 1}: ${value.title} => ${value.content}`);
        });
    });
}

function view(title) {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return { success: false, error: err };
        }

        const notes = JSON.parse(data);
        const note = notes.find((value) => value.title === title);
        if (!note) {
            console.log('Заметка не найдена');
        } else {
            console.log(note.content);
        }
    });
}

function remove(title) {
    fs.readFile(fileName, (err, data) => {
        if (err) {
            return { success: false, error: err };
        }

        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.title !== title);
        writeToFile(notes);
    });
}

switch (command) {
    case 'list':
        list();
        break;
    case 'view':
        view(title);
        break;
    case 'create':
        create(title, content);
        break;
    case 'remove':
        remove(title);
        break;

    default:
        console.log('Неизвестная команда'); // FIXME: Удалить этот console log
        break;
}

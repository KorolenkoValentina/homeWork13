// Вам необхідно написати додатокTodo list. У списку нотаток повинні бути методи для додавання нового запису, 
// видалення, редагування та отримання повної інформації про нотатку за ідентифікатором, 
// а так само отримання списку всіх нотаток. Крім цього, у користувача має бути можливість позначити нотаток, 
// як виконаний, і отримання інформації про те, скільки всього нотаток у списку і скільки залишилося невиконаними.
//  Нотатки не повинні бути порожніми.


// Кожний нотаток має назву, зміст, дату створення і редагування та статус. Нотатки бувають двох типів. 
// Дефолтні та такі, які вимагають підтвердження при ридагуванні.


// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка за ім'ям або змістом.
// Також окремо необхідно розширити список можливістю сортування нотаток за статусом або часом створення.



class Note {
  private id: number;
  private title: string;
  private content: string;
  private createdDate: Date;
  private isConfirmed: boolean;


  constructor(id: number, title: string, content: string) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdDate = new Date();
    this.isConfirmed = false;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  setTitle(newTitle: string) {
    this.title = newTitle;
  }

  getContent() {
    return this.content;
  }

  setContent(newContent: string) {
    this.content = newContent;
  }

  getCreatedDate() {
    return this.createdDate;
  }

  getIsConfirmed() {
    return this.isConfirmed;
  }

  setIsConfirmed(isConfirmed: boolean) {
    this.isConfirmed = isConfirmed;
  }

  confirmEdit() {
    this.isConfirmed = true;
  }
}

class TodoList {
  private notes: Note[];

  constructor() {
    this.notes = [];
  }

  // Метод для додавання нотаток
  addNote(title: string, content: string) {
    if (title.trim() !== '' && content.trim() !== '') {
      const newId = this.notes.length + 1;
      const note = new Note(newId, title, content);
      this.notes.push(note);
    } else {
      console.log('The title and table of contents cannot be empty.');
    }
  }

  // Метод для видалення нотатки за ідентифікатором
  deleteNote(id: number) {
    const noteIndex = this.notes.findIndex((note) => note.getId() === id);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
    }
  }

  // Метод для редагування нотатки за ідентифікатором
  editNote(id: number, newTitle: string, newContent: string) {
    const note = this.notes.find((note) => note.getId() === id);
    if (note) {
      note.setTitle(newTitle);
      note.setContent(newContent);
    }
  }


   // Метод для отримання нотатки за ідентифікатором
  getNoteById(id: number) {
    return this.notes.find((note) => note.getId() === id);
  }



  // Метод для отримання списку всіх нотаток
  getNoteList() {
    return this.notes;
  }


   // Метод для підтвердження редагування нотатки
  confirmEdit(id: number) {
    const note = this.notes.find((note) => note.getId() === id);
    if (note) {
      note.confirmEdit();
    }
  }

  // Метод для підрахунку загальної кількості нотаток
  getTotalNotes() {
    return this.notes.length;
  }

  // Метод для підрахунку кількості невиконаних нотаток
  getUnconfirmedNotesCount() {
    return this.notes.filter((note) => !note.getIsConfirmed()).length;
  }

  // Метод для позначення нотатки, як виконаної, за ідентифікатором
  markNoteAsDone(id: number) {
    const note = this.notes.find((note) => note.getId() === id);
    if (note) {
      note.setIsConfirmed(true);
    }
  }
  // Метод для пошуку нотаток за ім'ям або змістом
  searchNotes(query: string) {
    return this.notes.filter(
      (note) =>
        note.getTitle().includes(query) || note.getContent().includes(query)
    );
  }


  // Метод для сортування нотаток за статусом або часом створення
  sortNotes(by: 'status' | 'createdDate'): Note[] {
    if (by === 'status') {
      return this.notes.sort((a, b) => {
        if (a.getIsConfirmed() === b.getIsConfirmed()) {
          return 0;
        }
        return a.getIsConfirmed() ? 1 : -1;
      });
    } else if (by === 'createdDate') {
      return this.notes.sort((a, b) => a.getCreatedDate().getTime() - b.getCreatedDate().getTime());
    }
  return [];
}

}

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

  private _createdDate: Date;
  private _isConfirmed: boolean;
  private modifiedDate: Date;

  constructor( 
    private id: number,
    private _title: string,
    private _content: string,
    private type: 'default' | 'requiresConfirmation' = 'default'
    ){
    this._createdDate = new Date();
    this._isConfirmed = false;
    this.modifiedDate = this._createdDate;
    
  }

  get getId(): number {
    return this.id;
  }

  get title(): string {
    return this._title;
  }

  set title(newTitle: string) {
    this._title = newTitle;
  }

  get content(): string {
    return this._content;
  }

  set content(newContent: string) {
    this._content = newContent;
  }

  get createdDate(): Date {
    return this._createdDate;
  }

  get isConfirmed(): boolean {
    return this._isConfirmed;
  }

  set isConfirmed(isConfirmed: boolean) {
    this._isConfirmed = isConfirmed;
  }

  getModifiedDate = (): Date => {
    return this.modifiedDate;
  }
  
  updateModifiedDate = (): void => {
    this.modifiedDate = new Date();
  }
  
  confirmEdit = (): void => {
    this.isConfirmed = true;
  }
}

class TodoList {
  private notes: Note[];

  constructor() {
    this.notes = [];
  }

  // Метод для додавання нотаток
  addNote(title: string, content: string, type: 'default' | 'requiresConfirmation' = 'default') {
    if (title.trim() !== '' && content.trim() !== '') {
      const newId = this.notes.length + 1;
      const note = new Note(newId, title, content, type);
      this.notes.push(note);
    } else {
      console.log('The title and table of contents cannot be empty.');
    }
  }

  // Метод для видалення нотатки за ідентифікатором
  deleteNote(id: number) {
    const noteIndex = this.notes.findIndex((note) => note.getId === id);
    if (noteIndex !== -1) {
      this.notes.splice(noteIndex, 1);
    }
  }

  // Метод для редагування нотатки за ідентифікатором
  editNote(id: number, newTitle: string, newContent: string) {
    const note = this.notes.find((note) => note.getId === id);
    if (note) {
      note.title = newTitle;
      note.content = newContent;
      note.updateModifiedDate();
    }
  }
  


  // Метод для отримання нотатки за ідентифікатором
  getNoteById(id: number): Note | undefined  {
    return this.notes.find((note) => note.getId === id);
  }



  // Метод для отримання списку всіх нотаток
  getNoteList(): Note[]{
    return this.notes;
  }


   // Метод для підтвердження редагування нотатки
  confirmEdit(id: number) {
    const note = this.notes.find((note) => note.getId === id);
    if (note) {
      note.confirmEdit();
    }
  }

  // Метод для підрахунку загальної кількості нотаток
  getTotalNotes(): number {
    return this.notes.length;
  }

  // Метод для підрахунку кількості невиконаних нотаток
  getUnconfirmedNotesCount(): number {
    return this.notes.filter((note) => !note.isConfirmed).length;
  }

  // Метод для позначення нотатки, як виконаної, за ідентифікатором
  markNoteAsDone(id: number): void {
    const note = this.notes.find((note) => note.getId === id);
    if (note) {
      note.isConfirmed = true;
    }
  }

  // Метод для пошуку нотаток за ім'ям або змістом
  searchNotes(query: string): Note[] {
    return this.notes.filter(
      (note) =>
        note.title.includes(query) || note.content.includes(query)
    );
  }


  // Метод для сортування нотаток за статусом або часом створення
  sortNotes(by: 'status' | 'createdDate'): Note[] {
    if (by === 'status') {
      return this.notes.sort((a, b) => {
        if (a.isConfirmed === b.isConfirmed) {
          return 0;
        }
        return a.isConfirmed ? -1 : 1;
      });
    } else if (by === 'createdDate') {
      return this.notes.slice().sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
    }
    return [];
  }
}



const todoList = new TodoList();
todoList.addNote("Завдання 1", "Сходити в супермаркет" )
todoList.addNote("Завдання 2", "Погуляти з собакою")
todoList.addNote("Завдання 3", "Приготувати обід")
todoList.addNote("Завдання 4", "Зробити уроки з дитиною")
console.log(todoList.getNoteList());

todoList.deleteNote(1); 
console.log(todoList.getNoteList());

todoList.editNote(3,"Завдання 3", "Приготувати сніданок");
console.log(todoList.getNoteList());

const note = todoList.getNoteById(2);
console.log(note?.title);
console.log(note?.content);


const allNotes = todoList.getNoteList();
console.log(allNotes);


todoList.confirmEdit(2); 

const totalNotes = todoList.getTotalNotes();
console.log(`Загальна кількість нотаток: ${totalNotes}`);

const unconfirmedNotes = todoList.getUnconfirmedNotesCount();
console.log(`Кількість невиконаних нотаток: ${unconfirmedNotes}`);

todoList.markNoteAsDone(1); 

const searchResults = todoList.searchNotes("обід");
console.log(searchResults); 

const sortedByStatus = todoList.sortNotes("status"); 
console.log(sortedByStatus);

const sortedByCreatedDate = todoList.sortNotes("createdDate"); 
console.log(sortedByCreatedDate);





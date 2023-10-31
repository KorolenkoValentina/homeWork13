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

  get inCompletedCount(): number {
    return this.notes.filter((note) => !note.isCompleted).length;
  }

  getModifiedDate(): Date {
  return this.modifiedDate;
  }

  updateModifiedDate(): void {
  this.modifiedDate = new Date();
  }

   confirmEdit(): void {
  this.isConfirmed = true;
  }

  searchNotesByTitleOrContent(query: string): INote[] {
    return NoteSearch.searchByTitleOrContent(this.notes, query);
  }

  public addNote(title: string, content: string, requiresConfirmation: boolean = false): void {
    if (!title.trim() || !content.trim())
      throw new Error('The title and content cannot be empty');
    
    const note = requiresConfirmation ? new NoteConfirmed(title, content) : new Note(title, content);
    this.notes.push(note);
  }


  public deleteNote(id: Uuid): INote {
    const noteIndex = this.findIndexById(id);
    const [deletedNote] = this.notes.splice(noteIndex, 1);
    return deletedNote as INote;
  }
  

  public editNote(id: Uuid, payload: NoteUpdate): INote | undefined {
    const noteIndex = this.findIndexById(id);
    const note = this.notes[noteIndex];

    if (note) {
      const oldNote = { ...note };
      note.update(payload);
      return oldNote;
    }
    return undefined;
  }


  public getNoteById(id: Uuid): INote | undefined {
    const note = this.notes[this.findIndexById(id)];
    if (note) {
      return note;
    }
    return undefined; 
  }


  public getNoteList(): INote[] {
    return this.notes;
  }

  public complete(id: Uuid): void {
    const note = this.getNoteById(id);
    if (note) {
      note.complete();
    }
  }


  private findIndexById(id: Uuid): number {
    const noteIndex = this.notes.findIndex((x) => x.id === id);

    if (noteIndex === -1) throw new Error(`${id} is not defined`);
    return noteIndex;
  }

  

}


abstract class BaseNote implements INote {
  readonly id: Uuid = Math.floor(Math.random() * 100);
  readonly createdDate = new Date();
  modifiedDate: Date | null = null;
  isCompleted = false;
  needsConfirmation: boolean = false

  constructor(public title: string, public content: string) {}

  public abstract update({ title, content }: NoteUpdate): void;

  complete(): void {
    this.isCompleted = true;
  }
}



class Note extends BaseNote {

  public  update ({title, content}:NoteUpdate) :void{
    if (title?.trim())this.title=title
    if (content?.trim())this.content=content
    this.modifiedDate = new Date()
  }

}


class NoteConfirmed extends BaseNote{
  constructor(title: string, content: string) {
    super(title, content);
    this.needsConfirmation = true;
  }

  public update({ title, content }: NoteUpdate): void {
    if (this.needsConfirmation) { 
      if (title?.trim()) this.title = title; 
      if (content?.trim()) this.content = content; 
      this.modifiedDate = new Date();
    }
  }

  // Метод для пошуку нотаток за ім'ям або змістом
  searchNotes(query: string): Note[] {
    return this.notes.filter(
      (note) =>
        note.title.includes(query) || note.content.includes(query)
    );
  }

  static sortByStatus(notes: INote[]): INote[] {
    return notes.slice().sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }
}


class NoteSearch{
  static searchByTitleOrContent(notes: INote[], query: string): INote[]  {
  const lowercaseQuery = query.toLowerCase();
  return notes.filter((note) =>
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.content.toLowerCase().includes(lowercaseQuery)
  );
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
console.log("Усі нотатки:", allNotes);

// Отримання кількості нотаток та невиконаних нотаток
console.log("Загальна кількість нотаток:", todoList.allCount);
console.log("Кількість невиконаних нотаток:", todoList.inCompletedCount);

// Позначення нотатки як виконаної
const noteToComplete = allNotes[0].id; 
todoList.complete(noteToComplete);
console.log("Нотатка відзначена як виконана");

// Редагування нотатки
const noteToEdit = allNotes[1].id; 
const updatedNote = todoList.editNote(noteToEdit, { title: "Нове завдання" });
if (updatedNote) {
  console.log("Нотатка успішно відредагована:", updatedNote);
} else {
  console.log("Нотатка для редагування не знайдена");
}

// Видалення нотатки
const noteToDelete = allNotes[2].id; 
const deletedNote = todoList.deleteNote(noteToDelete);
console.log("Нотатка видалена:", deletedNote);


// Отримання повної інформації про нотатку за ідентифікатором
const noteIdToGetInfo = allNotes[1].id; // 
const noteInfo = todoList.getNoteById(noteIdToGetInfo);
if (noteInfo) {
  console.log("Інформація про нотатку:", noteInfo);
} else {
  console.log("Нотатка з таким ідентифікатором не знайдена");
}



// Сортування списку за датою та виведення результату
const notesSortedByDate = NoteSorter.sortByDate(todoList.getNoteList());
console.log("Нотатки відсортовані за датою:", notesSortedByDate);

// Сортування нотаток за статусом
const notesSortedByStatus = NoteSorter.sortByStatus(todoList.getNoteList());
console.log("Нотатки відсортовані за статусом:", notesSortedByStatus);

// Пошук нотаток за ім'ям або змістом
const searchQuery = "завдання";
const searchResult = NoteSearch.searchByTitleOrContent(todoList.getNoteList(), searchQuery);
console.log(`Результат пошуку за запитом "${searchQuery}":`, searchResult);
 




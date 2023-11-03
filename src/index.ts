// Вам необхідно написати додатокTodo list. У списку нотаток повинні бути методи для додавання нового запису, 
// видалення, редагування та отримання повної інформації про нотатку за ідентифікатором, 
// а так само отримання списку всіх нотаток. Крім цього, у користувача має бути можливість позначити нотаток, 
// як виконаний, і отримання інформації про те, скільки всього нотаток у списку і скільки залишилося невиконаними.
//  Нотатки не повинні бути порожніми.


// Кожний нотаток має назву, зміст, дату створення і редагування та статус. Нотатки бувають двох типів. 
// Дефолтні та такі, які вимагають підтвердження при ридагуванні.


// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка за ім'ям або змістом.
// Також окремо необхідно розширити список можливістю сортування нотаток за статусом або часом створення.


type Uuid = number;

interface INote {
  readonly id: Uuid;
  title: string;
  content: string;
  readonly createdDate: Date;
  modifiedDate: Date | null;
  isCompleted: boolean;
  update({title, content}: NoteUpdate): void;
  complete(): void;
  needsConfirmation: boolean;
}

type NoteUpdate = Partial<Pick<INote, 'title' | 'content'>>;
type NoteType = Note | NoteConfirmed;

interface ISearchable {
  searchNotesByTitleOrContent(query: string): INote[];
}

interface ISorte{
  sortByDate(notes: INote[]): INote[] 
  sortByStatus(notes: INote[]): INote[]
}

interface ITodoList  {

  addNote(title: string, description: string, confirm: boolean): void;

  deleteNote: (id: Uuid)=> INote | undefined;

  editNote: (id: Uuid, {title, content}: NoteUpdate)=> void

  getNoteById: (id: Uuid) => INote | undefined;

  getNoteList: () =>INote[];

  allCount: number;
  inCompletedCount: number;


}


class TodoList implements ITodoList {
 notes : NoteType[] = [];

  get allCount():number{
    return this.notes.length
  }

  get inCompletedCount(): number {
    return this.notes.filter((note) => !note.isCompleted).length;
  }


  public addNote(title: string, content: string, confirm: boolean = false): void {
    if (!title.trim() || !content.trim())
      throw new Error('The title and content cannot be empty');
    
    const note = confirm ? new NoteConfirmed(title, content) : new Note(title, content);
    this.notes.push(note);
  }


  public deleteNote(id: Uuid): INote | undefined {
    let noteIndex = this.findIndexById(id);

    let [deleteNote] = this.notes.splice(noteIndex, 1);
    return deleteNote;

}
  

  public editNote(id: Uuid, payload: NoteUpdate): INote {
    const noteIndex = this.findIndexById(id);
    const note = this.notes[noteIndex];
    const oldNote = {...note} as INote;
    note.update(payload);
    return oldNote;
  }


  getNoteById(id: Uuid): INote {
    const note = this.notes[this.findIndexById(id)];
    if (!note) throw new Error('Can not be find note by the id');
    return note;
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
}

class NoteSorter extends TodoList implements ISorte  {
  public sortByDate(notes: INote[]): INote[] {
    return notes.slice().sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
  }

  public sortByStatus(notes: INote[]): INote[] {
    return notes.slice().sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }
}


class NoteSearch extends TodoList implements ISearchable{
  public searchNotesByTitleOrContent(query: string): INote[] {
    const foundNotes: INote[] = this.notes.filter(
      (note) => note.title.toLowerCase().includes(query.toLowerCase()) || note.content.toLowerCase().includes(query.toLowerCase())
    );
    return foundNotes;
  }

  setNotes(notes: NoteType[]) {
    this.notes = notes;
  }
}



const todoList = new TodoList();

todoList.addNote("Покупки", "Молоко, хліб,сік, йогурт, яйця",true);
todoList.addNote("Прогулянка", "Погуляти з собакою");
todoList.addNote("Завдання", "Виконати проект до кінця тижня",true);
todoList.addNote("Спорт", "Піти на йогу");
todoList.addNote("Подорож", "Забронювати готель на відпустку");

// Отримання списку всіх нотаток
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
todoList.editNote(noteToEdit, { title: "Нова назва", content: "Оновлені дані" });
console.log(todoList.getNoteList())

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


const noteSorter = new NoteSorter();
const searchableTodo = new NoteSearch();
const notes = todoList.getNoteList();

// Сортування за датою створення
const sortedByDate = noteSorter.sortByDate(notes);
console.log("Сортування за датою:", sortedByDate);

// Сортування за статусом (завершено/не завершено)
const sortedByStatus = noteSorter.sortByStatus(notes);
console.log("Сортування за статусом:", sortedByStatus);


// Пошук нотаток за ключовим словом
searchableTodo.setNotes(notes);
const foundNotes = searchableTodo.searchNotesByTitleOrContent("Завдання");
console.log("Знайдені нотатки:", foundNotes);



// Ще один варіант


/*type Uuid = number;

interface INote {
  readonly id: Uuid;
  title: string;
  content: string;
  readonly createdDate: Date;
  modifiedDate: Date | null;
  isCompleted: boolean;
  complete(): void;
}

interface INoteEditable extends INote {
  update: (payload: NoteUpdate) => void;
}

interface INoteEditableWithConfirm extends INote {
  update: (payload: NoteUpdate, confirm: boolean) => void;
}

type NoteType = INoteEditable | INoteEditableWithConfirm;

type NoteUpdate = Partial<Pick<INote, 'title' | 'content'>>;

interface ITodoList {
  addNote: (title: string, content: string, confirm?: boolean) => void;
  deleteNote: (id: Uuid) => INote;
  editNote: (id: Uuid, payload: NoteUpdate, confirm?: boolean) => INote | undefined;
  getNoteById: (id: Uuid) => INote | undefined;
  getNoteList: () => NoteType[];
  allCount: number;
  inCompletedCount: number;
 
}

interface ISearchable {
  searchNotesByTitleOrContent(query: string): INote[];
}

interface ISorte{
   sortByDate(notes: INote[]): INote[] 
   sortByStatus(notes: INote[]): INote[]
}

class TodoList implements ITodoList {
  protected notes: NoteType[] = [];

  get allCount(): number {
    return this.notes.length;
  }

  get inCompletedCount(): number {
    return this.notes.filter((note) => !note.isCompleted).length;
  }

  public addNote(title: string, content: string, confirm: boolean = false): void {
    if (!title.trim() || !content.trim()) throw new Error('The title and content cannot be empty');

    const note = confirm ? new NoteConfirmed(title, content) : new Note(title, content);
    this.notes.push(note);
  }

  public deleteNote(id: Uuid): INote {
    const noteIndex = this.findIndexById(id);
    const [deletedNote] = this.notes.splice(noteIndex, 1);
    return deletedNote as INote;
  }

  public editNote(id: Uuid, payload: NoteUpdate, confirm: boolean = false): INote | undefined {
    const noteIndex = this.findIndexById(id);
    const note = this.notes[noteIndex] as NoteType;

    if ('update' in note) {
      (note as INoteEditableWithConfirm).update(payload, confirm);
    } else {
      (note as INoteEditable).update(payload);
    }

    return note;
  }


  public getNoteById(id: Uuid): INote | undefined {
    const note = this.notes.find((x) => x.id === id);
    return note ? note : undefined;
  }

  public getNoteList(): NoteType[] {
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

class TodoListWithSearch extends TodoList implements ISearchable {
  public searchNotesByTitleOrContent(query: string): INote[] {
    const foundNotes: INote[] = this.notes.filter(
      (note) => note.title.toLowerCase().includes(query.toLowerCase()) || note.content.toLowerCase().includes(query.toLowerCase())
    );
    return foundNotes;
  }
  setNotes(notes: NoteType[]) {
    this.notes = notes;
  }
}

class NoteSorter extends TodoList implements ISorte{
  public sortByDate(notes: INote[]): INote[] {
    return notes.slice().sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());
  }

  public sortByStatus(notes: INote[]): INote[] {
    return notes.slice().sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted));
  }
}

abstract class BaseNote implements INote {
  readonly id: Uuid = Math.floor(Math.random() * 100);
  readonly createdDate = new Date();
  modifiedDate: Date | null = null;
  isCompleted = false;
  needsConfirmation: boolean = false;

  constructor(public title: string, public content: string) {}

  public abstract update({ title, content }: NoteUpdate): void;

  complete(): void {
    this.isCompleted = true;
  }
}

class Note extends BaseNote {
  public update({ title, content }: NoteUpdate): void {
    if (title?.trim()) this.title = title;
    if (content?.trim()) this.content = content;
    this.modifiedDate = new Date();
  }
}

class NoteConfirmed extends BaseNote {
  public update({ title, content }: NoteUpdate, confirm: boolean = false): void {
    if (!confirm) throw new Error('Confirmation required');
    if (title?.trim()) this.title = title;
    if (content?.trim()) this.content = content;
    this.modifiedDate = new Date();
  }
}



const todoList = new TodoList();

todoList.addNote("Покупки", "Молоко, хліб,сік, йогурт, яйця",true);
todoList.addNote("Прогулянка", "Погуляти з собакою");
todoList.addNote("Завдання", "Виконати проект до кінця тижня",true);
todoList.addNote("Спорт", "Піти на йогу");
todoList.addNote("Подорож", "Забронювати готель на відпустку");

// Отримання списку всіх нотаток
console.log(todoList.getNoteList());

// Позначення нотатки як виконаної
const noteIdToMarkAsCompleted: Uuid = 1; 
todoList.complete(noteIdToMarkAsCompleted);
const updatedNoteList = todoList.getNoteList();
console.log(updatedNoteList);

// Редагування нотатки

const noteIdToEdit: Uuid = 2; 
const updatedNote = todoList.editNote(noteIdToEdit,{ title: "Нове завдання", content: 'Оновлене вміст' });
console.log(todoList.getNoteList());


// Отримання кількості нотаток та невиконаних нотаток
const totalNotesCount = todoList.allCount;
console.log("Загальна кількість нотаток:", totalNotesCount);
const inCompletedNotesCount = todoList.inCompletedCount;
console.log("Кількість невиконаних нотаток:", inCompletedNotesCount);

// Видалення нотатки
const noteIdToDelete: Uuid = 3; 
const deletedNote = todoList.deleteNote(noteIdToDelete);


// Отримання повної інформації про нотатку за ідентифікатором

const noteIdToRetrieve: Uuid = 5; 
const noteInfo = todoList.getNoteById(noteIdToRetrieve);
if (noteInfo) {
  console.log("Інформація про нотатку:", noteInfo);
} else {
  console.log("Нотатка з таким ідентифікатором не знайдена");
}


const noteSorter = new NoteSorter();
const searchableTodo = new TodoListWithSearch();

const notes = todoList.getNoteList();

// Сортування за датою створення
const sortedByDate = noteSorter.sortByDate(notes);
console.log("Сортування за датою:", sortedByDate);

// Сортування за статусом (завершено/не завершено)
const sortedByStatus = noteSorter.sortByStatus(notes);
console.log("Сортування за статусом:", sortedByStatus);


// Пошук нотаток за ключовим словом
searchableTodo.setNotes(notes);
const foundNotes = searchableTodo.searchNotesByTitleOrContent("Завдання");
console.log("Знайдені нотатки:", foundNotes);*/


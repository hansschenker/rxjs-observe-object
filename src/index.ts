import {
  tap,
  scan,
  interval,
  map,
  filter,
  BehaviorSubject,
  fromEvent,
  debounceTime,
  Observable,
  startWith,
  merge,
  combineLatest,
} from "rxjs";
import "./style.css";



const el = (elName: string) => document.getElementById(elName) as HTMLElement;

console.clear();

interface Person {
  name: string;
  age: number;
}

type PersonKeys = keyof(Person)

const hans = { name: "Hans", age: 42};

//const elResult = el("result")
function renderPerson(p: Partial<Person>) {
  console.log(p);
  el("result").innerText = ("age:" + p.age?.toString() + " name:" + p.name)
}


const personState = new BehaviorSubject<Person>(hans);
personState.pipe(
    scan((p: Partial<Person>, prop: Partial<Person>) => ({ ...p, ...prop }), hans)
  ).subscribe((p) => renderPerson(p));

function fromInputTarget(inputTarget: HTMLInputElement) { return inputTarget.value;}

// name
const nameChanges = fromEvent(el ("name"), "change").pipe(map((e) => fromInputTarget(e.target as HTMLInputElement)));
nameChanges.subscribe(v => personState.next({...personState.getValue(), name:  v}));

// age
const ageChanges = fromEvent(el("age"), "change").pipe(map((e) => fromInputTarget(e.target as HTMLInputElement)));
ageChanges.subscribe((v) => personState.next({ ...personState.getValue(), age: parseInt(v) }));


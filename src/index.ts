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
  Subject,
  observable,
  OperatorFunction,
  mapTo,
  Subscription
} from "rxjs";
import "./style.css";

import { source } from "./test.js";

export const combineSources = (...sources: []) =>
  combineLatest(...sources).pipe(
    map(values => values.reduce((a, c:[]) => ({ ...a, ...c }), {}))
  )
  export const assign = (obj1:object) => map((obj2: object ) => ({ ...obj2, ...obj1 }))

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


// manage subscriptions
const sub = new Subscription();

const personState = new BehaviorSubject<Person>(hans);
personState.pipe(
    scan((p: Partial<Person>, prop: Partial<Person>) => ({ ...p, ...prop }), hans)
  ).subscribe((p) => renderPerson(p));

function fromInputTarget(inputTarget: HTMLInputElement) { return inputTarget.value;}

// name
const nameChanges = fromEvent(el ("name"), "change").pipe(map((e) => fromInputTarget(e.target as HTMLInputElement)));
const nameSbs = nameChanges.subscribe(v => personState.next({...personState.getValue(), name:  v}));

// age
const ageChanges = fromEvent(el("age"), "change").pipe(map((e) => fromInputTarget(e.target as HTMLInputElement)));
const ageSbs = ageChanges.subscribe((v) => personState.next({ ...personState.getValue(), age: parseInt(v) }));

// count
function renderCount(count: string) {const countEl = el("count").innerText = count;}
const incChanges = fromEvent(el("inc"),"click").pipe(mapTo((x:number) => x + 1)) 
const decChanges = fromEvent(el("dec"),"click").pipe(mapTo((x:number) => x - 1)) 
 merge(incChanges, decChanges).pipe(scan((acc: number, fn: Function) => fn(acc), 0))
.subscribe(n => renderCount(n.toString()))

// handle subscriptions
const subEl = fromEvent(el("subscription"), "click").pipe(
  tap( _ => sub.unsubscribe())
)
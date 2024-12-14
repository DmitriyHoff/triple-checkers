
enum FieldState {
  PLAYER1 = 0x1,
  PLAYER2 = 0x2,
  PLAYER3 = 0x4,
  QUEEN = 0xff,
};

const defaultStateP1: string[] = [
  "a1",
  "a3",
  "b2",
  "c1",
  "c3",
  "d2",
  "e1",
  "e3",
  "f2",
  "g1",
  "g3",
  "h2",
];

const defaultStateP2 = [
  "l8",
  "l6",
  "k7",
  "j8",
  "j6",
  "i7",
  "d8",
  "d6",
  "c7",
  "b8",
  "b6",
  "a7",
];

const defaultStateP3 = [
  "h12",
  "h10",
  "g11",
  "f12",
  "f10",
  "e11",
  "i12",
  "i10",
  "j11",
  "k12",
  "k10",
  "l11",
];

const fieldNames = {
  i10: "i10",
  i12: "i12",
  j9: "j9",
  j11: "j11",
  k10: "k10",
  k12: "k12",
  l9: "l9",
  l11: "l11",
  e9: "e9",
  g9: "g9",
  f10: "f10",
  h10: "h10",
  e11: "e11",
  g11: "g11",
  f12: "f12",
  h12: "h12",
  e3: "e3",
  e1: "e1",
  f4: "f4",
  f2: "f2",
  g3: "g3",
  g1: "g1",
  h4: "h4",
  h2: "h2",
  d4: "d4",
  b4: "b4",
  c3: "c3",
  a3: "a3",
  d2: "d2",
  b2: "b2",
  c1: "c1",
  a1: "a1",
  d6: "d6",
  d8: "d8",
  c5: "c5",
  c7: "c7",
  b6: "b6",
  b8: "b8",
  a5: "a5",
  a7: "a7",
  i5: "i5",
  k5: "k5",
  j6: "j6",
  l6: "l6",
  i7: "i7",
  k7: "k7",
  j8: "j8",
  l8: "l8",
};

class BoardState extends EventTarget {
  protected _state: Uint8Array;
  protected _fieldsArray: string[]
  

  constructor() {
    super();
    this._state = new Uint8Array(48);
    this._fieldsArray = [
      "i10",
      "i12",
      "j9",
      "j11",
      "k10",
      "k12",
      "l9",
      "l11",
      "e9",
      "g9",
      "f10",
      "h10",
      "e11",
      "g11",
      "f12",
      "h12",
      "e3",
      "e1",
      "f4",
      "f2",
      "g3",
      "g1",
      "h4",
      "h2",
      "d4",
      "b4",
      "c3",
      "a3",
      "d2",
      "b2",
      "c1",
      "a1",
      "d6",
      "d8",
      "c5",
      "c7",
      "b6",
      "b8",
      "a5",
      "a7",
      "i5",
      "k5",
      "j6",
      "l6",
      "i7",
      "k7",
      "j8",
      "l8",
    ];
    this.init();
  }

  setFieldState(field: string, value: number) {
    const index = this._fieldsArray.indexOf(field);
    this._state[index] = value;
    this.dispatchEvent(new Event("stateUpdated"));
  }

  getFieldState(field: string) {
    const index = this._fieldsArray.indexOf(field);
    return (index === -1) ? null : this._state[index];
  }

  init() {
    for (let i = 0; i < defaultStateP1.length; i++) {
      this.setFieldState(defaultStateP1[i], FieldState.PLAYER1);
    }
    for (let i = 0; i < defaultStateP2.length; i++) {
      this.setFieldState(defaultStateP2[i], FieldState.PLAYER2);
    }
    for (let i = 0; i < defaultStateP3.length; i++) {
      this.setFieldState(defaultStateP3[i], FieldState.PLAYER3);
    }
  }

  get state() {
    const res: any[] = [];
    this._state.forEach((value, index) => {
      const t = { f: this._fieldsArray[index], value }
      res.push(t);
    });

    return res;
  }
}

export { FieldState, BoardState };

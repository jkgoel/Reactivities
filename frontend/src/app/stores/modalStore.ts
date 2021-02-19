import { makeAutoObservable } from 'mobx';

interface MOdal {
  open: boolean;
  body: JSX.Element | null;
}
export default class ModalStore {
  modal: MOdal = {
    open: false,
    body: null,
  };

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (content: JSX.Element) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}

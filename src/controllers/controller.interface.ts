import { Router } from 'express';

interface Controller {
  router: Router;
  path: String;
}

export default Controller;

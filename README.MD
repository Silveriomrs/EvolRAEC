# EvolRAEC

## Changelog:

27.01.26
Deep restructuring and refactoring of the UNED compilator EvolRAEC.

Working version without exceptions.
No tested yet.

Get back from previous refactoring of some functions take them back to compiler.js from view.js

The view is horrible yet, it requires to analize oficial UNED version since this branch started from another different with deep changes in the view and maybe in other sides.

## TODO
- [X] Decoupling partially the view
- [X] Back button for 'código intermedio' branch.
- [X] Decoupling and encapsulating partially the model from 'compilador.js'
- [ ] Unify view with the official one
- [ ] Decoupling Table methods from compiler isolating them into table.js
- [ ] Encapsulate some attributes for tables.
- [ ] Implement back buttom for 'Código Fuente' branch
- [ ] Finish decoupling for the View.
- [ ] Finish decoupling for the Model (tables).
- [ ] Restructure the logic into an object arquitecture.
- [ ] Implement full STATE encapsulation.
- [ ] Implement snapshoot navigation instead step to step one.
- [ ] Deep final tests.
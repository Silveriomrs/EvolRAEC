# EvolRAEC

## Changelog:

27.01.26
Deep restructuring and refactoring of the UNED compilator EvolRAEC.

Working version without exceptions.
No tested yet.

Get back from previous refactoring of some functions take them back to compiler.js from view.js

The view is horrible yet, it requires to analize oficial UNED version since this branch started from another different with deep changes in the view and maybe in other sides.

31.01.26
Deep bugfixes, restructuring & CSS changes. Let a lot of improvements yet and more bugs. In this change the APP works fine as original one, with the botton back for Instructions steps correct working again. Left button back fix.

02.02.26
Back function implemented for each tab succesfully. Also refactored functions and some bug fixes. Left cosmetic changes in the VIEW, remove some logs and some extra refactoring to decouple the View, Model and Control a little more.

08.02.26
Deep refactoring, integration with compilador.js from UNED official site (integrating differences/functions), remake CSS and Help structure, also others to acomplish WCAG 2.1 yet it needs deeper changes in some parts to do.  

## TODO
- [X] Decoupling partially the view
- [X] Back button for 'código intermedio' branch.
- [X] Decoupling and encapsulating partially the model from 'compilador.js'
- [X] Unify view with the official one
- [ ] Decoupling Table methods from compiler isolating them into table.js
- [ ] Encapsulate some attributes for tables.
- [X] Implement back buttom for 'Código Fuente' branch
- [ ] Finish decoupling for the View.
- [ ] Finish decoupling for the Model (tables).
- [ ] Restructure the logic into an object arquitecture.
- [ ] Implement full STATE encapsulation.
- [ ] Implement snapshoot navigation instead step to step one.
- [ ] Deep final tests.
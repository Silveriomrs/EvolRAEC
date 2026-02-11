# EvolRAEC

## Subject
EvolRaec is an online compiler that helps to understand how a code is compiled and run into a machine. Develop as a studying software for UNED university it shows all main aspects in computing code.

## Motivation
Very often the most difficult task is to restructure an software that "works". That tasks requires to understand how, when and why it works. What sometimes is a weak balance where lot of factor are implicated.

What could be modified without affecting the main purpose or functionality could become a real challange.

This project is done as a way to excersice myself in taking a higly coupled project, restructure it in order to improve scalability, functionality and understanding.

Initially to add a back button functionality (done very first try), it went further than that, becoming a deep restructuring of the whole project.

The original project belongs to the author Ing. Jaime Alcalá and its director Dr. Fernando López Ostenero. It is under UNED license.


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
- [ ] Restructure and clear HTMLs files.
- [ ] Restructure & clear CSS.
- [X] Separete Icons into a JS file.
- [ ] WCAG 2.0 certification.
- [ ] WCAG 2.1 certification.
- [ ] Deep final tests.

## Changelog:

**11.02.26**
Decoupling functions, refactors. Preparing the functions to be translated into tables.js.

**10.02.26**
NaN bug detected and fixed. Now works completely fine. It requires some refactoring and new functions to manage numbers from String before to manipulate it, making safe and clean code (at least much more than originally).

**08.02.26**
Deep refactoring, integration with compilador.js from UNED official site (integrating differences/functions), remake CSS and Help structure, also others to acomplish WCAG 2.1 yet it needs deeper changes in some parts to do.  

**02.02.26**
Back function implemented for each tab succesfully. Also refactored functions and some bug fixes. Left cosmetic changes in the VIEW, remove some logs and some extra refactoring to decouple the View, Model and Control a little more.

**31.01.26**
Deep bugfixes, restructuring & CSS changes. Let a lot of improvements yet and more bugs. In this change the APP works fine as original one, with the botton back for Instructions steps correct working again. Left button back fix.


**27.01.26**
Deep restructuring and refactoring of the UNED compilator EvolRAEC.

Working version without exceptions.
No tested yet.

Get back from previous refactoring of some functions take them back to compiler.js from view.js

The view is horrible yet, it requires to analize oficial UNED version since this branch started from another different with deep changes in the view and maybe in other sides.
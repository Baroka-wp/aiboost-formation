## Les bases du Javascript

### **Variables et types de données** :

Créez une variable pour chaque type de données fondamental en JavaScript (string, number, boolean, array, object) et assignez-leur des valeurs appropriées.

```javascript
let string = "toto" #string;
let num = 1 #number;
let bool = false #boolean;
let arr = [1, 2, 3,4] #array;
let obj = {name: "toto", age:12, adult: false}
```

### **Fonctions** :

Écrivez une fonction qui prend deux nombres en entrée et retourne leur somme.

```javascript
const sum = (a, b) => {
    if (isNaN(a) || isNaN(b)) return "Please enter only numbers";
    return a + b;
}
```

### **Conditions** :

Écrivez un code qui vérifie si un nombre donné est pair ou impair et affiche un message approprié.

```javascript
let a = 3;

if(a%2 === 0){
	console.log("ce nombre est paire")
} else {
	console.log("ce nom est impaire")
}
```

### Questions intermédiaires

### **Boucles** :

Écrivez une boucle qui affiche les nombres de 1 à 10.

```javascript
for(let i = 1; i <11;  i++){
	console.log(i)
}
```

[loop for](https://www.w3schools.com/js/js_loop_for.asp)

### **Manipulation de tableaux** :

Créez un tableau de nombres et écrivez une fonction qui trouve le nombre maximum dans ce tableau.

```javascript
const arr = [3,2,4,5,6,9,10];

const max = (arr) => {

    let max = -Infinity;
    
    arr.forEach((item) => {
       if(item > max) {
          max = item;
       };
     }
     
     return max
 });
 
 console.log(max(arr))
```

- [Comment déclarer une variable Infinie](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)
- [Boucle forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)

### **Objets** :

Créez un objet représentant une personne avec les propriétés suivantes : nom, âge, profession. Écrivez une méthode pour cet objet qui affiche une phrase décrivant la personne.

```javascript
const persona = {
    name: "Toto",
    age: 21,
    profession: "Teacher",
    describe() {
        return `My name is ${this.name}, I'm ${this.age} years old and my profession is ${this.profession}`;
    }
}

console.log(persona.describe());
```

### Questions avancées

### **Fonctions d'ordre supérieur** :

Utilisez `map` pour transformer un tableau de nombres en un tableau où chaque nombre est multiplié par 2.

```javascript
const arr = [3, 2, 4, 5, 6, 9, 10];

const arr2 = arr.map((a) => a * 2);

console.log(arr2);
```

### **Asynchronisme** :

Écrivez une fonction asynchrone qui récupère des données depuis une API (vous pouvez simuler l'API avec `setTimeout`).

```javascript
const asynFunct = async(url) => {
     const response = await fetch(url);
     const data = await response.json()
		 return data
}
```

- [Utiliser le Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Utiliser setTimeout](https://www.w3schools.com/jsref/met_win_settimeout.asp)
- [Comprendre les Promessesen JS](https://www.freecodecamp.org/news/how-to-write-a-javascript-promise-4ed8d44292b8/)

### **Closures** :

Expliquez ce qu'est une closure en JavaScript et donnez un exemple.

 *Un closure est une fonction qui se souvient de l'environnement dans lequel elle a été créée.*

***Exemple*** 

```javascript
function closure() {
let name = "Toto";
function displayName() {
		console.log(name);
}

function changeName(name){
		this.name = name
}

return displayName;
}

const nameFunc = closure();
nameFunc(); // => "Toto"
```

[Comprendre Les closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
[Qu'est-ce qu'une closure ?](https://www.notion.so/Qu-est-ce-qu-une-closure-ea8012aef5a142f0a05de920e0c3c661?pvs=21)
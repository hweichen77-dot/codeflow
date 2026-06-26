export default {
  "project": {
    "id": "csa-05",
    "title": "Writing Classes",
    "description": "Design your own Java classes from scratch using instance variables, constructors, accessor and mutator methods, the this keyword, encapsulation, static members, toString, and method decomposition.",
    "difficulty": "intermediate",
    "category": "apcsa",
    "order": 205,
    "track": "apcsa",
    "unit": "Unit 5 — Writing Classes",
    "tags": [
      "instance vars",
      "constructors",
      "encapsulation"
    ]
  },
  "lessons": [
    {
      "id": "csa-05-l1",
      "project_id": "csa-05",
      "order": 1,
      "title": "Anatomy of a Class",
      "concept": "class anatomy",
      "xp_reward": 10,
      "explanation": "## What a Class Is\n\nA **class** is a blueprint that describes a kind of object. It bundles together two things: **state** (the data an object remembers) and **behavior** (the actions an object can perform). Every object you create from the class is an **instance** of it, and each instance carries its own copy of the state.\n\nThink of a class like an architectural plan for a house. The plan is not a house you can live in, but from one plan you can build many houses. Each house (object) has its own paint color and furniture (state) even though they all share the same floor plan (class).\n\n## The Parts of a Class\n\nA typical AP CSA class has four sections, written in this order by convention:\n\n- **Instance variables** — the fields that hold each object's state, usually `private`.\n- **Constructors** — special methods that initialize a new object.\n- **Accessor and mutator methods** — let outside code safely read or change the state.\n- **Other methods** — the behaviors that operate on the state.\n\n```java\npublic class Dog {\n    private String name;      // instance variable (state)\n    private int age;          // instance variable (state)\n\n    public Dog(String n, int a) {   // constructor\n        name = n;\n        age = a;\n    }\n\n    public String getName() {       // accessor\n        return name;\n    }\n\n    public String speak() {         // behavior\n        return name + \" says woof\";\n    }\n}\n```\n\n## Objects vs. Classes\n\nYou never run a class directly. Instead you build objects from it using the `new` keyword:\n\n```java\nDog d = new Dog(\"Rex\", 3);\nSystem.out.println(d.speak());   // Rex says woof\n```\n\nHere `Dog` is the **class** (the blueprint) and `d` refers to one **object** (a built instance). The variable `d` stores a **reference** to the object, not the object itself.\n\nKey ideas to keep:\n\n- A class defines **state** and **behavior** once.\n- Objects are concrete instances built with `new`.\n- Each object has its **own** copy of the instance variables.\n- The class name is capitalized by convention (`Dog`, `Student`, `BankAccount`).",
      "challenge_title": "Greet a Person",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        // TODO: build a Person with this name and print its greeting\n    }\n}\n\nclass Person {\n    private String name;\n\n    public Person(String n) {\n        name = n;\n    }\n\n    // TODO: write a greet() method that returns \"Hello, <name>\"\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String name = sc.next();\n        Person p = new Person(name);\n        System.out.println(p.greet());\n    }\n}\n\nclass Person {\n    private String name;\n\n    public Person(String n) {\n        name = n;\n    }\n\n    public String greet() {\n        return \"Hello, \" + name;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "Ada",
          "expected_output": "Hello, Ada"
        },
        {
          "input": "Grace",
          "expected_output": "Hello, Grace"
        },
        {
          "input": "Linus",
          "expected_output": "Hello, Linus"
        }
      ],
      "key_terms": [
        {
          "term": "Class",
          "definition": "A blueprint that defines the state (instance variables) and behavior (methods) shared by all objects of its type."
        },
        {
          "term": "Object",
          "definition": "A concrete instance of a class, built with the new keyword, holding its own copy of the instance variables."
        },
        {
          "term": "Reference",
          "definition": "A value stored in a variable that points to an object in memory rather than holding the object itself."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What keyword builds an object from a class?",
          "options": [
            "make",
            "new",
            "object",
            "create"
          ],
          "correct_index": 1,
          "explanation": "The new keyword allocates an object and runs the constructor, returning a reference to it."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the relationship between a class and an object?",
          "options": [
            "A class is an instance of an object",
            "A class is a blueprint and an object is a built instance of it",
            "They are two words for the same thing",
            "An object contains many classes"
          ],
          "correct_index": 1,
          "explanation": "A class is the blueprint; objects are concrete instances created from that blueprint with new."
        },
        {
          "question": "Which statement about instance variables is true?",
          "options": [
            "All objects of a class share one copy of each instance variable",
            "Each object gets its own copy of the instance variables",
            "Instance variables can only be ints",
            "Instance variables must be declared inside main"
          ],
          "correct_index": 1,
          "explanation": "Every object built from the class has its own independent copy of the instance variables."
        }
      ]
    },
    {
      "id": "csa-05-l2",
      "project_id": "csa-05",
      "order": 2,
      "title": "Instance Variables and State",
      "concept": "instance vars",
      "xp_reward": 10,
      "explanation": "## State Lives in Instance Variables\n\nThe **state** of an object is everything it remembers about itself. In Java, that state is stored in **instance variables** (also called **fields**). They are declared inside the class but **outside any method**, so every method of the object can use them.\n\n```java\npublic class Counter {\n    private int count;   // instance variable\n}\n```\n\nBecause they live at the class level, instance variables exist for the entire lifetime of the object, unlike **local variables** which exist only while their method runs.\n\n## Default Values\n\nIf a constructor does not assign an instance variable, Java gives it a **default value** automatically:\n\n- numeric types (`int`, `double`) default to `0` / `0.0`\n- `boolean` defaults to `false`\n- object references (like `String`) default to `null`\n\nLocal variables get **no** default — you must initialize them before use, or the compiler complains.\n\n## Each Object Has Its Own State\n\nBecause every object carries its own instance variables, changing one object never affects another:\n\n```java\nCounter a = new Counter();\nCounter b = new Counter();\na.increment();   // a.count is now 1\n// b.count is still 0\n```\n\nThis independence is the whole point of objects: `a` and `b` model two separate counters.\n\n## Naming and Scope\n\nKey distinctions to remember:\n\n- **Instance variables** describe object state and persist for the object's life.\n- **Local variables** and **parameters** exist only during a single method call.\n- Instance variables are typically `private` so only the class itself can change them.\n\n```java\npublic class BankAccount {\n    private double balance;       // state, persists\n\n    public void deposit(double amount) {  // amount is local\n        balance = balance + amount;       // update state\n    }\n}\n```\n\nWhen you read `balance` inside a method without any object name in front of it, Java assumes you mean *this* object's `balance`. That implicit reference is the foundation we build on in later lessons with the `this` keyword.",
      "challenge_title": "Score Keeper",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Counter c = new Counter();\n        // TODO: call addPoints n times with values read from input, then print the total\n    }\n}\n\nclass Counter {\n    private int total;\n\n    public void addPoints(int p) {\n        // TODO: add p to total\n    }\n\n    public int getTotal() {\n        return total;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        Counter c = new Counter();\n        for (int i = 0; i < n; i++) {\n            int p = sc.nextInt();\n            c.addPoints(p);\n        }\n        System.out.println(c.getTotal());\n    }\n}\n\nclass Counter {\n    private int total;\n\n    public void addPoints(int p) {\n        total = total + p;\n    }\n\n    public int getTotal() {\n        return total;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3\n10 20 5",
          "expected_output": "35"
        },
        {
          "input": "1\n100",
          "expected_output": "100"
        },
        {
          "input": "4\n1 2 3 4",
          "expected_output": "10"
        }
      ],
      "key_terms": [
        {
          "term": "Field",
          "definition": "Another name for an instance variable; a class-level variable that stores part of an object's state."
        },
        {
          "term": "Default value",
          "definition": "The value Java automatically gives an unassigned instance variable: 0 for numbers, false for booleans, null for references."
        },
        {
          "term": "Local variable",
          "definition": "A variable declared inside a method that exists only during that method call and has no default value."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What is the default value of an int instance variable that is never assigned?",
          "options": [
            "null",
            "undefined",
            "0",
            "1"
          ],
          "correct_index": 2,
          "explanation": "Numeric instance variables default to 0 (0.0 for double); references default to null and booleans to false."
        }
      ],
      "quiz_questions": [
        {
          "question": "How do instance variables differ from local variables?",
          "options": [
            "Instance variables exist for the object's lifetime; local variables exist only during a method call",
            "Local variables persist longer than instance variables",
            "They are identical",
            "Instance variables cannot be private"
          ],
          "correct_index": 0,
          "explanation": "Instance variables hold object state for the whole object lifetime, while local variables vanish when the method returns."
        },
        {
          "question": "If account a deposits money, what happens to a separate account b?",
          "options": [
            "b's balance also increases",
            "b's balance is unchanged",
            "b is deleted",
            "Both accounts share one balance"
          ],
          "correct_index": 1,
          "explanation": "Each object has its own instance variables, so changing a never affects b."
        }
      ]
    },
    {
      "id": "csa-05-l3",
      "project_id": "csa-05",
      "order": 3,
      "title": "Constructors",
      "concept": "constructors",
      "xp_reward": 10,
      "explanation": "## What a Constructor Does\n\nA **constructor** is a special method whose only job is to initialize a new object's instance variables. It runs automatically when you use `new`. Two rules define a constructor:\n\n- Its name is **exactly the class name**.\n- It has **no return type** — not even `void`.\n\n```java\npublic class Point {\n    private int x;\n    private int y;\n\n    public Point(int startX, int startY) {\n        x = startX;\n        y = startY;\n    }\n}\n```\n\nCalling `new Point(3, 4)` runs this constructor with `startX = 3` and `startY = 4`, setting the object's `x` and `y`.\n\n## The Default Constructor\n\nIf you write **no constructor at all**, Java silently provides a hidden **no-argument constructor** that leaves every field at its default value. The moment you write *any* constructor, that free one disappears:\n\n```java\npublic class Point {\n    private int x, y;\n    public Point(int x, int y) { this.x = x; this.y = y; }\n}\n\nPoint p = new Point();   // COMPILE ERROR — no zero-arg constructor exists\n```\n\nIf you still want `new Point()` to work, you must write it yourself.\n\n## Overloaded Constructors\n\nA class may have **several constructors** as long as their parameter lists differ. This is called **overloading**:\n\n```java\npublic class Point {\n    private int x, y;\n\n    public Point() {           // origin\n        x = 0;\n        y = 0;\n    }\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n}\n```\n\nJava picks the matching constructor by the arguments you pass. `new Point()` runs the first; `new Point(5, 2)` runs the second.\n\n## Validating Input\n\nConstructors are a good place to guard against bad data:\n\n```java\npublic Person(int age) {\n    if (age < 0) {\n        age = 0;\n    }\n    this.age = age;\n}\n```\n\nKey takeaways: a constructor matches the class name, has no return type, initializes state, and can be overloaded so objects can be built in different ways.",
      "challenge_title": "Time Builder",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int h = sc.nextInt();\n        int m = sc.nextInt();\n        Time t = new Time(h, m);\n        System.out.println(t.totalMinutes());\n    }\n}\n\nclass Time {\n    private int hours;\n    private int minutes;\n\n    // TODO: write a constructor taking hours and minutes\n\n    public int totalMinutes() {\n        return hours * 60 + minutes;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int h = sc.nextInt();\n        int m = sc.nextInt();\n        Time t = new Time(h, m);\n        System.out.println(t.totalMinutes());\n    }\n}\n\nclass Time {\n    private int hours;\n    private int minutes;\n\n    public Time(int h, int m) {\n        hours = h;\n        minutes = m;\n    }\n\n    public int totalMinutes() {\n        return hours * 60 + minutes;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "2 30",
          "expected_output": "150"
        },
        {
          "input": "0 45",
          "expected_output": "45"
        },
        {
          "input": "1 0",
          "expected_output": "60"
        }
      ],
      "key_terms": [
        {
          "term": "Constructor",
          "definition": "A special method with the class's name and no return type that initializes a new object's instance variables."
        },
        {
          "term": "Default constructor",
          "definition": "A no-argument constructor Java supplies automatically only when the class declares no constructor of its own."
        },
        {
          "term": "Overloading",
          "definition": "Defining multiple constructors (or methods) with the same name but different parameter lists so Java can pick one by the arguments."
        }
      ],
      "inline_quizzes": [
        {
          "question": "Why might new Point() fail to compile?",
          "options": [
            "Point is misspelled",
            "A constructor with parameters was written, removing the free no-arg constructor",
            "Point has no instance variables",
            "new is the wrong keyword"
          ],
          "correct_index": 1,
          "explanation": "Once you write any constructor, Java no longer provides the free no-argument one, so new Point() fails unless you add it."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which is a valid constructor for class Cat?",
          "options": [
            "public void Cat() { }",
            "public Cat() { }",
            "public int Cat() { return 0; }",
            "public constructor Cat() { }"
          ],
          "correct_index": 1,
          "explanation": "A constructor has the class name and no return type, so public Cat() { } is correct; the others declare return types."
        },
        {
          "question": "What makes constructor overloading legal?",
          "options": [
            "The constructors have different names",
            "The constructors have different parameter lists",
            "The constructors return different types",
            "Only one constructor is allowed per class"
          ],
          "correct_index": 1,
          "explanation": "Overloaded constructors share the class name but must differ in their parameter lists so Java can tell them apart."
        }
      ]
    },
    {
      "id": "csa-05-l4",
      "project_id": "csa-05",
      "order": 4,
      "title": "Accessor and Mutator Methods",
      "concept": "accessors",
      "xp_reward": 10,
      "explanation": "## Reading and Changing State Safely\n\nInstance variables are usually `private`, so outside code cannot touch them directly. To let other code work with an object's state, a class exposes **public methods**. Two common kinds are accessors and mutators.\n\n## Accessor Methods (Getters)\n\nAn **accessor** (or **getter**) returns the value of an instance variable without changing it. By convention its name starts with `get`, and its return type matches the variable:\n\n```java\npublic class Student {\n    private String name;\n    private int grade;\n\n    public String getName() {   // accessor\n        return name;\n    }\n\n    public int getGrade() {     // accessor\n        return grade;\n    }\n}\n```\n\nAn accessor that returns a `boolean` often starts with `is` instead, like `isEmpty()`.\n\n## Mutator Methods (Setters)\n\nA **mutator** (or **setter**) changes the value of an instance variable. Its name usually starts with `set`, it takes the new value as a parameter, and it returns `void`:\n\n```java\npublic void setGrade(int newGrade) {\n    grade = newGrade;\n}\n```\n\nBecause a mutator controls the change, it can **validate** input — something direct field access could never do:\n\n```java\npublic void setGrade(int newGrade) {\n    if (newGrade >= 0 && newGrade <= 12) {\n        grade = newGrade;\n    }\n}\n```\n\nNow the object refuses impossible grades, keeping its state valid.\n\n## Why Methods Instead of Public Fields\n\nUsing methods as a gate between the outside world and the data gives you control:\n\n- You can **validate** values before storing them.\n- You can **compute** a returned value instead of storing it (`getArea()` from width and height).\n- You can change how data is stored later without breaking other code.\n\n```java\npublic class Rectangle {\n    private int width, height;\n    public int getArea() {        // computed accessor\n        return width * height;\n    }\n}\n```\n\nKey idea: accessors **read** state and return a value; mutators **change** state and usually return `void`. Both keep the object in charge of its own data.",
      "challenge_title": "Clamp the Volume",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int v = sc.nextInt();\n        Speaker s = new Speaker();\n        s.setVolume(v);\n        System.out.println(s.getVolume());\n    }\n}\n\nclass Speaker {\n    private int volume;\n\n    public void setVolume(int v) {\n        // TODO: clamp v into the range 0..100 before storing it\n    }\n\n    public int getVolume() {\n        return volume;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int v = sc.nextInt();\n        Speaker s = new Speaker();\n        s.setVolume(v);\n        System.out.println(s.getVolume());\n    }\n}\n\nclass Speaker {\n    private int volume;\n\n    public void setVolume(int v) {\n        if (v < 0) {\n            volume = 0;\n        } else if (v > 100) {\n            volume = 100;\n        } else {\n            volume = v;\n        }\n    }\n\n    public int getVolume() {\n        return volume;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "50",
          "expected_output": "50"
        },
        {
          "input": "150",
          "expected_output": "100"
        },
        {
          "input": "-20",
          "expected_output": "0"
        }
      ],
      "key_terms": [
        {
          "term": "Accessor",
          "definition": "A method (often named get...) that returns the value of an instance variable without modifying it."
        },
        {
          "term": "Mutator",
          "definition": "A method (often named set...) that changes an instance variable, usually returning void and able to validate the new value."
        },
        {
          "term": "Validation",
          "definition": "Logic inside a mutator or constructor that checks incoming data and rejects or corrects invalid values before storing them."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What return type does a typical mutator method have?",
          "options": [
            "int",
            "The type of the field it changes",
            "void",
            "boolean"
          ],
          "correct_index": 2,
          "explanation": "A mutator usually returns void because its job is to change state, not to hand back a value."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the main advantage of a mutator over a public field?",
          "options": [
            "It runs faster",
            "It can validate or adjust the value before storing it",
            "It uses less memory",
            "It removes the need for a constructor"
          ],
          "correct_index": 1,
          "explanation": "A mutator method can check and correct incoming values, so the object can protect its own validity."
        },
        {
          "question": "Which method is an accessor?",
          "options": [
            "public void setAge(int a)",
            "public int getAge()",
            "public void reset()",
            "public void increment()"
          ],
          "correct_index": 1,
          "explanation": "getAge() returns the value of a field without changing it, which is exactly what an accessor does."
        }
      ]
    },
    {
      "id": "csa-05-l5",
      "project_id": "csa-05",
      "order": 5,
      "title": "The this Keyword",
      "concept": "this",
      "xp_reward": 10,
      "explanation": "## What this Refers To\n\nInside an instance method or constructor, **`this`** is a reference to **the object the method was called on**. When you write `d.speak()`, inside `speak()` the keyword `this` refers to the same object `d` points to. It lets an object talk about itself.\n\n## Resolving Name Conflicts\n\nThe most common use of `this` is to fix a naming clash. A constructor parameter and an instance variable often share a name for readability. Without `this`, the parameter **shadows** the field:\n\n```java\npublic class Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        x = x;   // BUG: assigns the parameter to itself\n        y = y;   // the instance variables stay 0\n    }\n}\n```\n\nUsing `this` makes the left side mean the *field* and the right side the *parameter*:\n\n```java\npublic Point(int x, int y) {\n    this.x = x;   // this.x is the field, x is the parameter\n    this.y = y;\n}\n```\n\n## Passing the Current Object\n\nBecause `this` is a reference to the current object, you can pass it to other methods or return it:\n\n```java\npublic class Account {\n    private double balance;\n\n    public Account deposit(double amount) {\n        this.balance += amount;\n        return this;          // hand back the same object\n    }\n}\n```\n\nReturning `this` lets calls be chained: `acct.deposit(10).deposit(5)`.\n\n## When You Can Omit this\n\nIf there is no name conflict, `this` is optional. These two lines do the same thing inside a method:\n\n```java\nbalance = balance + amount;        // implicit this\nthis.balance = this.balance + amount;  // explicit this\n```\n\nKey points:\n\n- `this` always refers to **the object the method is running on**.\n- Use `this.field = param;` to assign a parameter to a same-named instance variable.\n- `this` is only meaningful inside **instance** methods and constructors, never inside `static` methods.",
      "challenge_title": "Point Distance Squared",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p.distSqFromOrigin());\n    }\n}\n\nclass Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        // TODO: use this to assign the parameters to the fields\n    }\n\n    public int distSqFromOrigin() {\n        return x * x + y * y;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p.distSqFromOrigin());\n    }\n}\n\nclass Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public int distSqFromOrigin() {\n        return x * x + y * y;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 4",
          "expected_output": "25"
        },
        {
          "input": "0 0",
          "expected_output": "0"
        },
        {
          "input": "5 12",
          "expected_output": "169"
        }
      ],
      "key_terms": [
        {
          "term": "this",
          "definition": "A reference, valid inside instance methods and constructors, that points to the object the method was invoked on."
        },
        {
          "term": "Shadowing",
          "definition": "When a parameter or local variable has the same name as an instance variable, hiding the field unless this is used."
        },
        {
          "term": "Method chaining",
          "definition": "Calling several methods in a row on the same object, enabled when methods return this."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In the constructor body this.x = x;, what does each x mean?",
          "options": [
            "Both refer to the parameter",
            "this.x is the instance variable, x is the parameter",
            "this.x is the parameter, x is the field",
            "Both refer to the field"
          ],
          "correct_index": 1,
          "explanation": "this.x names the instance variable, while the bare x is the constructor parameter that shadows it."
        }
      ],
      "quiz_questions": [
        {
          "question": "Where can the keyword this be used?",
          "options": [
            "Only in the main method",
            "In static methods only",
            "In instance methods and constructors",
            "Anywhere, including static methods"
          ],
          "correct_index": 2,
          "explanation": "this refers to the current object, which only exists inside instance methods and constructors, never in static methods."
        },
        {
          "question": "What problem does writing x = x; inside a constructor cause?",
          "options": [
            "A compile error",
            "It assigns the parameter to itself and leaves the field at its default",
            "It deletes the field",
            "Nothing, it works correctly"
          ],
          "correct_index": 1,
          "explanation": "Without this, both x's are the parameter, so the field never receives the value and stays at its default."
        }
      ]
    },
    {
      "id": "csa-05-l6",
      "project_id": "csa-05",
      "order": 6,
      "title": "Encapsulation and private",
      "concept": "encapsulation",
      "xp_reward": 10,
      "explanation": "## Hiding the Internals\n\n**Encapsulation** is the practice of bundling an object's data together with the methods that operate on it, while hiding the data from outside code. In Java this is enforced with **access modifiers**, mainly `private` and `public`.\n\n- `private` — visible only inside the same class.\n- `public` — visible everywhere.\n\nThe standard pattern is **private fields, public methods**: lock the data down, then expose carefully chosen methods as the only doorway.\n\n```java\npublic class BankAccount {\n    private double balance;          // hidden state\n\n    public void deposit(double amt) {  // public gate\n        if (amt > 0) balance += amt;\n    }\n\n    public boolean withdraw(double amt) {\n        if (amt > 0 && amt <= balance) {\n            balance -= amt;\n            return true;\n        }\n        return false;\n    }\n\n    public double getBalance() {\n        return balance;\n    }\n}\n```\n\nCode outside `BankAccount` cannot write `acct.balance = -1000000;`. It must go through `deposit` and `withdraw`, which enforce the rules.\n\n## Why Encapsulation Matters\n\nMaking fields `private` gives three big benefits:\n\n- **Validity** — methods reject bad data, so the object never enters an impossible state.\n- **Control** — the class decides exactly what outsiders can do.\n- **Flexibility** — you can change how data is stored internally without breaking other code, as long as the public methods behave the same.\n\n## A Broken Invariant\n\nImagine `balance` were `public`. Any line anywhere could do `acct.balance -= 99999;` and overdraw the account. Encapsulation makes that impossible because the only way to reduce the balance is `withdraw`, which checks the funds first. The rule \"balance is never negative\" is called an **invariant**, and encapsulation is what protects it.\n\nKey points:\n\n- Encapsulation = data hiding + controlled access.\n- Mark instance variables `private`; expose `public` methods.\n- This protects the object's **invariants** and keeps the rest of the program simpler.",
      "challenge_title": "Safe Withdraw",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int start = sc.nextInt();\n        int amount = sc.nextInt();\n        Account a = new Account(start);\n        a.withdraw(amount);\n        System.out.println(a.getBalance());\n    }\n}\n\nclass Account {\n    private int balance;\n\n    public Account(int start) {\n        balance = start;\n    }\n\n    public void withdraw(int amount) {\n        // TODO: only subtract amount if 0 < amount <= balance\n    }\n\n    public int getBalance() {\n        return balance;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int start = sc.nextInt();\n        int amount = sc.nextInt();\n        Account a = new Account(start);\n        a.withdraw(amount);\n        System.out.println(a.getBalance());\n    }\n}\n\nclass Account {\n    private int balance;\n\n    public Account(int start) {\n        balance = start;\n    }\n\n    public void withdraw(int amount) {\n        if (amount > 0 && amount <= balance) {\n            balance -= amount;\n        }\n    }\n\n    public int getBalance() {\n        return balance;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "100 40",
          "expected_output": "60"
        },
        {
          "input": "100 200",
          "expected_output": "100"
        },
        {
          "input": "50 50",
          "expected_output": "0"
        }
      ],
      "key_terms": [
        {
          "term": "Encapsulation",
          "definition": "Bundling data with the methods that use it while hiding the data behind private access, exposing only chosen public methods."
        },
        {
          "term": "Access modifier",
          "definition": "A keyword such as private or public that controls where a field or method can be seen and used."
        },
        {
          "term": "Invariant",
          "definition": "A condition about an object's state that must always stay true, protected by encapsulation (e.g. balance is never negative)."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does the private modifier do to an instance variable?",
          "options": [
            "Makes it readable everywhere but not writable",
            "Makes it visible only inside its own class",
            "Deletes it after the constructor runs",
            "Makes it a constant"
          ],
          "correct_index": 1,
          "explanation": "private restricts access to within the same class, so outside code must use public methods to reach the data."
        }
      ],
      "quiz_questions": [
        {
          "question": "Which design follows good encapsulation?",
          "options": [
            "public fields, private methods",
            "private fields, public methods",
            "public fields, public methods",
            "everything private including methods needed by other classes"
          ],
          "correct_index": 1,
          "explanation": "Private fields with public methods hides the data and exposes a controlled interface, the standard encapsulation pattern."
        },
        {
          "question": "Why is encapsulation valuable when maintaining code?",
          "options": [
            "It makes programs run faster automatically",
            "Internal storage can change without breaking outside code as long as public methods behave the same",
            "It removes the need for constructors",
            "It allows fields to be accessed directly"
          ],
          "correct_index": 1,
          "explanation": "Because outsiders only depend on the public methods, the class can change how it stores data internally without affecting them."
        }
      ]
    },
    {
      "id": "csa-05-l7",
      "project_id": "csa-05",
      "order": 7,
      "title": "Static vs Instance Members",
      "concept": "static",
      "xp_reward": 10,
      "explanation": "## Two Kinds of Members\n\nA class can have **instance members** that belong to each object, and **static members** that belong to the **class itself**. The `static` keyword is the difference.\n\n- An **instance variable** has one copy *per object*.\n- A **static variable** (class variable) has **one copy shared by all objects**.\n\n```java\npublic class Robot {\n    private static int count = 0;   // shared by ALL robots\n    private int id;                 // unique to each robot\n\n    public Robot() {\n        count++;        // every new robot bumps the shared count\n        id = count;     // and takes the next id\n    }\n\n    public static int getCount() {  // static method\n        return count;\n    }\n\n    public int getId() {            // instance method\n        return id;\n    }\n}\n```\n\nAfter `new Robot(); new Robot(); new Robot();`, `Robot.getCount()` returns `3`, while each robot's `id` is `1`, `2`, `3`.\n\n## Static Methods\n\nA **static method** belongs to the class and is called on the class name, not an object:\n\n```java\nint total = Robot.getCount();   // call on the class\nMath.max(3, 7);                 // Math.max is static\n```\n\nBecause a static method has no specific object, it **cannot use `this`** and **cannot read instance variables** directly — there is no single object to read them from. It can only touch static fields and its own parameters.\n\n## Choosing Static or Instance\n\nUse the table of intent below:\n\n- If the data or behavior describes **one object**, make it an **instance** member.\n- If it describes the **whole class** or is a pure utility, make it **static**.\n\n```java\npublic class Circle {\n    public static final double PI = 3.14159;  // shared constant\n    private double radius;                      // per-object state\n\n    public double area() {\n        return PI * radius * radius;            // instance uses static\n    }\n}\n```\n\nKey points:\n\n- `static` members belong to the **class**; instance members belong to **objects**.\n- One static variable is **shared**; each instance variable is **per object**.\n- Static methods are called on the class name and **cannot access** instance variables or `this`.",
      "challenge_title": "Count the Widgets",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            new Widget();\n        }\n        System.out.println(Widget.getCount());\n    }\n}\n\nclass Widget {\n    // TODO: add a static count that increases each time a Widget is created\n\n    public Widget() {\n        // TODO\n    }\n\n    public static int getCount() {\n        // TODO: return the shared count\n        return 0;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            new Widget();\n        }\n        System.out.println(Widget.getCount());\n    }\n}\n\nclass Widget {\n    private static int count = 0;\n\n    public Widget() {\n        count++;\n    }\n\n    public static int getCount() {\n        return count;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3",
          "expected_output": "3"
        },
        {
          "input": "0",
          "expected_output": "0"
        },
        {
          "input": "7",
          "expected_output": "7"
        }
      ],
      "key_terms": [
        {
          "term": "Static variable",
          "definition": "A field marked static that has a single copy shared by every object of the class, also called a class variable."
        },
        {
          "term": "Static method",
          "definition": "A method belonging to the class, called on the class name, that cannot use this or access instance variables directly."
        },
        {
          "term": "Instance member",
          "definition": "A variable or method that belongs to an individual object, with its own copy or its own this reference."
        }
      ],
      "inline_quizzes": [
        {
          "question": "How many copies of a static variable exist for a class with 10 objects?",
          "options": [
            "10",
            "One, shared by all objects",
            "Zero",
            "One per method"
          ],
          "correct_index": 1,
          "explanation": "A static variable has exactly one copy shared across the whole class, regardless of how many objects exist."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why can a static method not directly read an instance variable?",
          "options": [
            "Instance variables are always private",
            "A static method has no specific object, so there is no this to read from",
            "Static methods run before objects exist",
            "It can, there is no restriction"
          ],
          "correct_index": 1,
          "explanation": "A static method belongs to the class, not an object, so there is no particular object whose instance variables it could read."
        },
        {
          "question": "How is the static method getCount() typically called?",
          "objects": [],
          "options": [
            "myWidget.getCount()",
            "Widget.getCount()",
            "new getCount()",
            "this.getCount()"
          ],
          "correct_index": 1,
          "explanation": "Static methods are invoked on the class name, so Widget.getCount() is the idiomatic call."
        }
      ]
    },
    {
      "id": "csa-05-l8",
      "project_id": "csa-05",
      "order": 8,
      "title": "toString and Method Decomposition",
      "concept": "toString",
      "xp_reward": 10,
      "explanation": "## Giving an Object a Readable Form\n\nBy default, printing an object shows something cryptic like `Point@1b6d3586`. Overriding **`toString`** lets you control the text Java uses whenever an object is printed or joined to a String:\n\n```java\npublic class Point {\n    private int x, y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public String toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n}\n```\n\nNow `System.out.println(p)` prints `(3, 4)`. Java automatically calls `toString` when an object appears where a String is expected, so `\"P = \" + p` works too. The method must be `public`, take no parameters, and return a `String`.\n\n## Method Decomposition\n\n**Method decomposition** is the practice of breaking a big task into several small, well-named methods, each doing one thing. Small methods are easier to read, test, and reuse. Compare a tangled method with a decomposed version:\n\n```java\npublic class Order {\n    private double price;\n    private int qty;\n\n    private double subtotal() {\n        return price * qty;\n    }\n\n    private double tax() {\n        return subtotal() * 0.08;\n    }\n\n    public double total() {\n        return subtotal() + tax();   // reads like English\n    }\n}\n```\n\nEach helper (`subtotal`, `tax`) is `private` because it is an internal detail; only `total` is `public`. The top-level method becomes a short, readable summary of the steps.\n\n## Guidelines for Decomposition\n\nGood decomposition follows a few rules:\n\n- Each method should do **one clear job** and be named for that job.\n- A method that grows long or has a comment like `// now compute tax` is a hint to extract a helper.\n- Helpers used only inside the class should be `private`.\n\nKey points:\n\n- Override `public String toString()` to give an object a meaningful printed form.\n- Java calls `toString` automatically during printing and String concatenation.\n- Decompose complex behavior into small, single-purpose methods, keeping internal helpers `private` and the public method readable.",
      "challenge_title": "Fraction toString",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int d = sc.nextInt();\n        Fraction f = new Fraction(n, d);\n        System.out.println(f);\n    }\n}\n\nclass Fraction {\n    private int num;\n    private int den;\n\n    public Fraction(int n, int d) {\n        num = n;\n        den = d;\n    }\n\n    // TODO: override toString to return \"num/den\"\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int d = sc.nextInt();\n        Fraction f = new Fraction(n, d);\n        System.out.println(f);\n    }\n}\n\nclass Fraction {\n    private int num;\n    private int den;\n\n    public Fraction(int n, int d) {\n        num = n;\n        den = d;\n    }\n\n    public String toString() {\n        return num + \"/\" + den;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "1 2",
          "expected_output": "1/2"
        },
        {
          "input": "3 4",
          "expected_output": "3/4"
        },
        {
          "input": "7 1",
          "expected_output": "7/1"
        }
      ],
      "key_terms": [
        {
          "term": "toString",
          "definition": "A public method returning a String that Java calls automatically when an object is printed or concatenated, giving it a readable form."
        },
        {
          "term": "Method decomposition",
          "definition": "Breaking a complex task into several small, single-purpose methods to improve readability, testing, and reuse."
        },
        {
          "term": "Helper method",
          "definition": "A usually private method that performs one internal step, called by a larger public method."
        }
      ],
      "inline_quizzes": [
        {
          "question": "When does Java automatically call an object's toString method?",
          "options": [
            "Only when you write object.toString() explicitly",
            "When the object is printed or used in String concatenation",
            "Only inside the constructor",
            "Never, you must always call it by name"
          ],
          "correct_index": 1,
          "explanation": "Java calls toString automatically whenever an object appears where a String is needed, such as in println or with the + operator."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the correct signature for toString?",
          "options": [
            "public void toString()",
            "public String toString()",
            "private String toString(String s)",
            "public String toString(int x)"
          ],
          "correct_index": 1,
          "explanation": "toString must be public, take no parameters, and return a String so Java can call it during printing."
        },
        {
          "question": "Why are helper methods like subtotal() often marked private?",
          "options": [
            "So they run faster",
            "Because they are internal details not meant to be called from outside the class",
            "Because private methods cannot be overridden",
            "So they become static automatically"
          ],
          "correct_index": 1,
          "explanation": "Helpers are implementation details, so keeping them private hides them and exposes only the meaningful public method."
        }
      ]
    }
  ]
}

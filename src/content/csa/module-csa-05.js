// AUTO-AUTHORED AP module. Edit via the content pipeline.
export default {
  "project": {
    "id": "csa-05",
    "title": "Writing Classes",
    "description": "Design your own Java classes with instance variables, constructors, accessor and mutator methods, encapsulation, the this keyword, and toString.",
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
      "title": "Instance Variables and Constructors",
      "explanation": "## Building a Class\n\nA **class** is a blueprint that describes the state and behavior of objects. The state of an object is stored in **instance variables** (also called fields). Each object created from the class gets its own copy of these variables.\n\nInstance variables are declared inside the class but outside any method. They are almost always marked `private` so that code outside the class cannot change them directly.\n\n```java\npublic class Student {\n    private String name;   // instance variable\n    private int grade;     // instance variable\n}\n```\n\n## Constructors\n\nA **constructor** is a special method that runs when an object is created with `new`. It has the **same name as the class** and **no return type** (not even `void`). Its job is to initialize the instance variables.\n\n```java\npublic class Student {\n    private String name;\n    private int grade;\n\n    public Student(String n, int g) {\n        name = n;     // assign parameter to instance variable\n        grade = g;\n    }\n}\n```\n\nYou create an object by calling the constructor:\n\n```java\nStudent s = new Student(\"Ada\", 11);\n```\n\n## Default Values and the No-Argument Constructor\n\nIf you write no constructor at all, Java provides a hidden **no-argument constructor** that sets numbers to `0`, booleans to `false`, and object references to `null`. As soon as you write any constructor, that free one disappears.\n\nKey points to remember:\n\n- Instance variables hold the **state** of one object.\n- Each object has its **own** copy of the instance variables.\n- Constructors **initialize** that state.\n- A constructor name must **match the class name exactly**.\n\nThink of the class as a cookie cutter and each object as a separate cookie. The cutter (class) defines the shape; every cookie (object) holds its own dough (instance variable values).",
      "challenge_title": "Rectangle Constructor",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n        // TODO: create a Rectangle with width w and height h, then print its area\n    }\n}\n\nclass Rectangle {\n    private int width;\n    private int height;\n\n    // TODO: write a constructor that stores width and height\n\n    public int area() {\n        return width * height;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int w = sc.nextInt();\n        int h = sc.nextInt();\n        Rectangle r = new Rectangle(w, h);\n        System.out.println(r.area());\n    }\n}\n\nclass Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int w, int h) {\n        width = w;\n        height = h;\n    }\n\n    public int area() {\n        return width * height;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 4",
          "expected_output": "12"
        },
        {
          "input": "5 5",
          "expected_output": "25"
        },
        {
          "input": "10 0",
          "expected_output": "0"
        }
      ],
      "key_terms": [
        {
          "term": "Instance variable",
          "definition": "A field declared in a class (outside any method) that stores the state of an individual object; each object has its own copy."
        },
        {
          "term": "Constructor",
          "definition": "A special method with the same name as the class and no return type that initializes a new object's instance variables when called with new."
        },
        {
          "term": "No-argument constructor",
          "definition": "A constructor that takes no parameters; Java supplies a hidden one only when no constructor is written explicitly."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does a constructor's signature look like?",
          "options": [
            "It has the same name as the class and no return type",
            "It is named init and returns void",
            "It has the same name as the class and returns int",
            "It must be named after the first instance variable"
          ],
          "correct_index": 0,
          "explanation": "A constructor shares the class name exactly and declares no return type, not even void."
        }
      ],
      "quiz_questions": [
        {
          "question": "Where are instance variables declared?",
          "options": [
            "Inside the main method",
            "Inside the class but outside any method",
            "Inside every method that uses them",
            "In a separate constructor file"
          ],
          "correct_index": 1,
          "explanation": "Instance variables are declared at the class level, outside methods, so all methods of the object can access them."
        },
        {
          "question": "What happens to the free no-argument constructor once you write your own constructor?",
          "options": [
            "It still exists alongside yours",
            "Java throws a compile error",
            "It is no longer provided automatically",
            "It becomes private"
          ],
          "correct_index": 2,
          "explanation": "Once any constructor is written, Java no longer supplies the default no-argument constructor automatically."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-05-l2",
      "project_id": "csa-05",
      "order": 2,
      "title": "Methods, Encapsulation, and this",
      "explanation": "## Encapsulation\n\n**Encapsulation** means hiding an object's internal data and exposing controlled access through methods. We achieve it by making instance variables `private` and providing public methods to read or change them.\n\n- An **accessor** (getter) returns the value of an instance variable.\n- A **mutator** (setter) changes the value of an instance variable, often with validation.\n\n```java\npublic class BankAccount {\n    private double balance;\n\n    public BankAccount(double start) {\n        balance = start;\n    }\n\n    public double getBalance() {   // accessor\n        return balance;\n    }\n\n    public void deposit(double amount) {  // mutator\n        if (amount > 0) {\n            balance = balance + amount;\n        }\n    }\n}\n```\n\nBecause `balance` is private, no outside code can set it to a negative value directly. The mutator guards the rules.\n\n## The this Keyword\n\nInside an instance method, **`this`** is a reference to the object the method was called on. It is most useful when a parameter has the **same name** as an instance variable. Without `this`, the parameter would shadow (hide) the field.\n\n```java\npublic class Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        this.x = x;   // this.x is the field, x is the parameter\n        this.y = y;\n    }\n}\n```\n\nHere `this.x` refers to the instance variable, while plain `x` refers to the parameter.\n\n## void vs Returning Methods\n\n- A method declared `void` performs an action but returns nothing.\n- A method with a return type must use a `return` statement to send back a value.\n\nKey ideas:\n\n- Keep fields `private`; expose behavior through public methods.\n- Accessors read; mutators change.\n- Use `this.field = field;` to resolve naming conflicts.\n- Mutators are the right place to enforce validity rules.",
      "challenge_title": "Counter with Mutators",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int start = sc.nextInt();\n        int times = sc.nextInt();\n        Counter c = new Counter(start);\n        for (int i = 0; i < times; i++) {\n            c.increment();\n        }\n        System.out.println(c.getCount());\n    }\n}\n\nclass Counter {\n    private int count;\n\n    public Counter(int count) {\n        // TODO: use this to assign the parameter to the field\n    }\n\n    public void increment() {\n        // TODO: add one to count\n    }\n\n    public int getCount() {\n        return count;\n    }\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int start = sc.nextInt();\n        int times = sc.nextInt();\n        Counter c = new Counter(start);\n        for (int i = 0; i < times; i++) {\n            c.increment();\n        }\n        System.out.println(c.getCount());\n    }\n}\n\nclass Counter {\n    private int count;\n\n    public Counter(int count) {\n        this.count = count;\n    }\n\n    public void increment() {\n        count = count + 1;\n    }\n\n    public int getCount() {\n        return count;\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "0 5",
          "expected_output": "5"
        },
        {
          "input": "10 3",
          "expected_output": "13"
        },
        {
          "input": "7 0",
          "expected_output": "7"
        }
      ],
      "key_terms": [
        {
          "term": "Encapsulation",
          "definition": "Hiding an object's data by making fields private and exposing controlled access through public methods."
        },
        {
          "term": "Mutator",
          "definition": "A method (setter) that changes the value of an instance variable, often validating the new value first."
        },
        {
          "term": "this",
          "definition": "A reference to the current object, used to distinguish an instance variable from a parameter of the same name."
        }
      ],
      "inline_quizzes": [
        {
          "question": "In the constructor `public Point(int x){ this.x = x; }`, what does `this.x` refer to?",
          "options": [
            "The parameter x",
            "The instance variable x",
            "A new local variable",
            "Nothing; it is a syntax error"
          ],
          "correct_index": 1,
          "explanation": "this.x refers to the instance variable, while the bare x refers to the parameter that shadows it."
        }
      ],
      "quiz_questions": [
        {
          "question": "Why are instance variables typically made private?",
          "options": [
            "To make the program run faster",
            "To enforce encapsulation and control access through methods",
            "Because public variables are illegal in Java",
            "So they get default values"
          ],
          "correct_index": 1,
          "explanation": "Private fields hide internal data; access is funneled through public methods, which is the core of encapsulation."
        },
        {
          "question": "What is the difference between an accessor and a mutator?",
          "options": [
            "An accessor changes a field; a mutator returns it",
            "An accessor returns a field's value; a mutator changes it",
            "Both return values",
            "Both are constructors"
          ],
          "correct_index": 1,
          "explanation": "Accessors (getters) read a field's value; mutators (setters) modify it."
        }
      ],
      "xp_reward": 100
    },
    {
      "id": "csa-05-l3",
      "project_id": "csa-05",
      "order": 3,
      "title": "Writing a toString Method",
      "explanation": "## Why toString Exists\n\nEvery Java object inherits a `toString` method from the `Object` class. The default version returns something unhelpful like `Student@1b6d3586` (the class name plus a hash code). By **overriding** `toString`, you decide how your object looks when printed.\n\nWhen you pass an object to `System.out.println`, or join it with a `String` using `+`, Java automatically calls that object's `toString` method.\n\n```java\npublic class Student {\n    private String name;\n    private int grade;\n\n    public Student(String name, int grade) {\n        this.name = name;\n        this.grade = grade;\n    }\n\n    public String toString() {\n        return name + \" (grade \" + grade + \")\";\n    }\n}\n```\n\nNow this code:\n\n```java\nStudent s = new Student(\"Ada\", 11);\nSystem.out.println(s);   // prints: Ada (grade 11)\n```\n\nprints a readable description instead of a cryptic address.\n\n## Rules for toString\n\n- It must be `public`, return a `String`, and take **no parameters**: `public String toString()`.\n- It should **build and return** a String, not print one.\n- It often uses string concatenation with `+` to combine fields.\n\n## Automatic Calls\n\nThe method is invoked automatically in two common situations:\n\n- `System.out.println(obj)` and `System.out.print(obj)`\n- String concatenation: `\"Result: \" + obj`\n\nYou can also call it explicitly with `obj.toString()`.\n\nKey ideas:\n\n- `toString` gives objects a **human-readable** form.\n- Overriding means replacing the inherited default behavior.\n- Return a String; let the caller decide whether to print it.\n- Concatenation and println trigger it automatically.",
      "challenge_title": "Point toString",
      "challenge_language": "java",
      "challenge_starter_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p);\n    }\n}\n\nclass Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    // TODO: override toString to return the form (x, y)\n}",
      "challenge_solution_code": "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        int y = sc.nextInt();\n        Point p = new Point(x, y);\n        System.out.println(p);\n    }\n}\n\nclass Point {\n    private int x;\n    private int y;\n\n    public Point(int x, int y) {\n        this.x = x;\n        this.y = y;\n    }\n\n    public String toString() {\n        return \"(\" + x + \", \" + y + \")\";\n    }\n}",
      "challenge_test_cases": [
        {
          "input": "3 4",
          "expected_output": "(3, 4)"
        },
        {
          "input": "0 0",
          "expected_output": "(0, 0)"
        },
        {
          "input": "-2 7",
          "expected_output": "(-2, 7)"
        }
      ],
      "key_terms": [
        {
          "term": "toString",
          "definition": "A method that returns a String representation of an object; overriding it controls how the object appears when printed."
        },
        {
          "term": "Override",
          "definition": "To provide a new definition of a method inherited from a superclass, replacing the inherited behavior."
        },
        {
          "term": "Object class",
          "definition": "The superclass of every Java class, which supplies a default toString that returns the class name plus a hash code."
        }
      ],
      "inline_quizzes": [
        {
          "question": "What does `System.out.println(myObject)` do when toString is overridden?",
          "options": [
            "Prints the memory address",
            "Automatically calls myObject.toString() and prints the result",
            "Causes a compile error",
            "Prints the class name only"
          ],
          "correct_index": 1,
          "explanation": "println automatically invokes the object's toString method and prints whatever String it returns."
        }
      ],
      "quiz_questions": [
        {
          "question": "What is the correct signature for toString?",
          "options": [
            "public void toString()",
            "public String toString(String s)",
            "public String toString()",
            "private String toString()"
          ],
          "correct_index": 2,
          "explanation": "toString must be public, return a String, and take no parameters."
        },
        {
          "question": "What should toString do with the String it builds?",
          "options": [
            "Print it with System.out.println",
            "Return it so the caller can use it",
            "Store it in a field",
            "Throw it as an exception"
          ],
          "correct_index": 1,
          "explanation": "toString should return the String, leaving the decision to print to the caller."
        }
      ],
      "xp_reward": 100
    }
  ]
}

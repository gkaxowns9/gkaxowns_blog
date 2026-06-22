# Enum (with Java)

생성일: 2025년 2월 9일 오후 1:01
상태: 정리 완료

<aside>
🚧

내가 쓰다가 귀찮아져서 claude 보고 쓰라함. 글 잘씀

</aside>

## 정의

- `Enum` 은 **열거형**이라고 하는 타입의 종류이며 **서로 연관된 상수들의 집합**을 의미한다.
이야기만 들었을 때는 집합이니까 뭐 List 비스무리 한거로 생각해볼 수 있지만, Enum을 주로 사용하는 Java의 경우 이를 Class처럼 사용한다는 정신나간소리를 한다. (역시 이넘. 이놈~ 할 듯)
- 사실 Enum과 List는 꽤 차이가 있다. 수학으로 생각하자면 Enum은 **집합**이고, List는 **수열**이다.
Enum은 List보다는 개인적으로 **객체화된 Map, Dictionary** 쯤이라고 생각한다.
- 계속 이렇게 설명하는 것보다 예시코드를 보는게 더 좋을 것 같으니 바로 예시코드를 보자

## 예시코드

```java
public enum testenum {
    A(1), B(2), C(3);
    
    private int value;
    
    private testenum(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }

    public static void main(String[] args) {
        for (testenum e : testenum.values()) {
            System.out.println(e + ": " + e.getValue());
        }
    }
}
```

- 코드를 봐도 이해가 안 되는 것이 정상이다. 한줄한줄 해석하면서 알아보자

### 선언

```java
public enum testenum { // Enum 선언
```

```java
public class test { // Class 선언
```

- 기존 자바의 `class` 의 선언 방식과 비슷하게 선언한다.

### 상수

```java
A(1), B(2), C(3);
```

- class와 다르게 `상수` 라는 개념이 존재한다. C 언어를 해 봤다면 `#define` 키워드를 사용하여 선언하는 것이 상수이다.

```c
#define A       1;
```

- 이렇게 선언된 상수는 수정이 불가능하며 대문자 영어로 작성하는 것이 원칙이다.

### 생성자

```java
private testenum(int value) {
    this.value = value;
}
```

```java
public test(int a) {
    this.a = a;
}
```

- 클래스의 생성자와 큰 차이는 없어 보이지만 가장 큰 차이는 `public` 으로 선언되는 클래스와 달리 `private` 으로 생성해야 한다는 점이다

### 필드

```java
private int value;

```

- 클래스의 필드와 동일하다. 각 상수마다 이 값을 가지게 된다.

### 메서드

```java
public int getValue() {
    return value;
}

```

- 클래스의 메서드와 동일하다. 각 상수의 value 값을 반환한다.

### 내장 메서드

```java
testenum.values()

```

- `values()` 는 모든 enum 상수를 배열로 반환하는 내장 메서드다.
- 위의 예시에서는 A, B, C를 순서대로 포함하는 배열을 반환한다.

```java
for (testenum e : testenum.values()) {
    System.out.println(e + ": " + e.getValue());
}

```

- 결과:

```
A: 1
B: 2
C: 3

```

## Enum을 사용하는 이유

### 1. 타입 안전성

```java
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

public void doSomething(Day day) {
    // day 매개변수는 반드시 Day enum의 값이어야 함
}

```

### 2. 코드의 가독성

```java
// 나쁜 예 - 숫자로 상태 표현
if (status == 1) { ... }

// 좋은 예 - Enum으로 상태 표현
if (status == Status.ACTIVE) { ... }

```

### 3. 유지보수성

- 새로운 상수를 추가하거나 기존 상수를 수정할 때 컴파일 타임에 오류를 잡을 수 있다.

## 실전 예시

```java
public enum HttpStatus {
    OK(200, "OK"),
    NOT_FOUND(404, "Not Found"),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error");

    private final int code;
    private final String message;

    private HttpStatus(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }

    // 코드로 HttpStatus 찾기
    public static HttpStatus fromCode(int code) {
        for (HttpStatus status : values()) {
            if (status.code == code) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown code: " + code);
    }
}

```

사용 예시:

```java
HttpStatus status = HttpStatus.OK;
System.out.println(status.getCode());    // 200
System.out.println(status.getMessage()); // OK

HttpStatus found = HttpStatus.fromCode(404);
System.out.println(found); // NOT_FOUND

```
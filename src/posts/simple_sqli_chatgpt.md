# simple_sqli_chatgpt

생성일: 2026년 6월 24일 오후 5:31
상태: 정리 완료
태그: 파이썬, Write-up, flask, dreamhack, webhacking, SQLi

## 문제 설명

- 간단한 SQL Injection을 활용하여 어드민 계정으로 로그인 하는 문제이다
  
  자세한 설명을 위해 드림핵에서 설명을 캡쳐했다

![설명](/img/writeup_series/gpt-description.png)

- 그렇다고 한다
  
  진짜로 GPT로 풀면 날먹일 것 같아 SQLi도 배웠겠다 직접 풀어보기로 했다

## 코드 분석

- 문제 파일을 받아보니 flask로 구현된 웹 서버 파일이 있었다 하나씩 분석해보자

```python
try:
    FLAG = open('./flag.txt', 'r').read()
except:
    FLAG = '[**FLAG**]'
```

- flag 값을 읽어오는 코드이다

```python
DATABASE = "database.db"
if os.path.exists(DATABASE) == False:
  db = sqlite3.connect(DATABASE)
  db.execute('create table users(userid char(100), userpassword char(100), userlevel integer);')
  db.execute(f'insert into users(userid, userpassword, userlevel) values ("guest", "guest", 0), ("admin", "{binascii.hexlify(os.urandom(16)).decode("utf8")}", 0);')
  db.commit()
  db.close()
```

- sqlite로 DB에 테이블을 만들고, guest와 admin 계정을 insert 한다. 여기서 admin의 비밀번호는 랜덤이라 알 수가 없고, userlevel은 두 계정 모두 0을 가진다.

```python
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html')
    else:
        userlevel = request.form.get('userlevel')
        res = query_db(f"select * from users where userlevel='{userlevel}'")
        if res:
            userid = res[0]
            userlevel = res[2]
            print(userid, userlevel)
            if userid == 'admin' and userlevel == 0:
                return f'hello {userid} flag is {FLAG}'
            return f'<script>alert("hello {userid}");history.go(-1);</script>'
        return '<script>alert("wrong");history.go(-1);</script>'
```

- 가장 메인이 되는 로그인 코드인데, 쿼리문을 보면 id와 password를 사용하지 않고 userlevel를 사용해서 select 쿼리를 날린다. 이게 어딘가 이상하다고 하는 이유인 것 같다
- query_db 함수는 생략하였지만, 쿼리 결과값의 가장 위 결과만 가져오는 함수다. DB에 insert할 때 guest 계정을 먼저 넣었으니 0을 넣으면 guest만 가져올 것이다

## payload 구상
- login 함수에서 userlevel를 사용해서 select 쿼리를 날리는데, 두 user 모두 값이 0으로 동일해서 userlevel를 다른 값으로 줄 수 없다
- 대신 쿼리문에 검증 로직이 없기 때문에 SQLi이 가능해서, 뒤에 `userid = admin` 같은 조건을 달면 될 것 같다

## 풀이
- 서버를 열고 login 페이지에 접속해서 input에 아래처럼 값을 넣어주었다.

![payload](/img/writeup_series/gpt_payload.png)
```SQL
0' and userid='admin' -- 
```
- 따옴표로 문자열을 닫고, `and` 를 이용해 두 조건을 이어준 후, `userid='admin'`으로 admin만 가져올 수 있게 했다. 마지막은 주석처리

- 결과로 flag을 얻을 수 있다

![payload](/img/writeup_series/gpt_flagg.png)
![payload](/img/writeup_series/gpt_flag.png)
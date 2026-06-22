# LangChain

생성일: 2025년 2월 7일 오전 9:42
상태: 정리 완료
태그: 인공지능, 파이썬, LangChain, LLM

🚧이 페이지는 [인프런-입문자를위한-랭체인-기초](https://www.inflearn.com/course/%EC%9E%85%EB%AC%B8%EC%9E%90%EB%A5%BC%EC%9C%84%ED%95%9C-%EB%9E%AD%EC%B2%B4%EC%9D%B8-%EA%B8%B0%EC%B4%88) 강의를 참고하여 작성됨

# LangChain (랭체인)

- 해리슨 체이스(Harrison Chase)에 의해 2022년 10월에 오픈 소스 프로젝트로 시작된 LLM 프레임워크다.
  개발자들이 챗봇, 질의응답 시스템, 자동 요약 등 다양한 LLM 애플리케이션을 쉽게 개발할 수 있도록 지원하는 것이 주 목적이다.
- 랭체인 프레임워크는 크게 라이브러리, 템플릿, 랭서브, 랭스미스 로 나뉘지만 여기에서는 **랭체인 라이브러리(LangChain Libraries)** 만 다루도록 하겠다. (애초에 랭체인 하면 대부분 라이브러리를 말한다)

## 라이브러리 설치 및 설정

- 기본적으로 이 페이지에서는 pythom 3.11, LangChain
  LangChain을 설치하면 langchain-core, langchain-community, langsmith 등이 함께 설치되어 프로젝트 수행에 필수적인 라이브러리들은 한번에 설치된다. 설치 명령어는 아래와 같다.

```bash
pip install langchain
```

- 또한 Openai의 모델을 사용한다면, 의존성 페키지 또한 설치해야 한다.

```bash
pip install langchain-openai tiktoken
```

- 그 후 Openai의 API key를 받아와 랭체인에 넣어주면 기본 설정은 다 끝이다.
  이후는 주피터 노트북을 이용해 코드와 같이 직접 실행하며 설명하겠다. (강의도 그럼)

```python
import os
from dotenv import load_dotenv
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```

# Chain(체인)

- 랭체인은 LLM의 관리를 Chain 이라는 것으로 한다.
- 아래 2가지의 체인을 참고하자.

### 1) Prompt + LLM (기본 체인)

- 말그대로 기본 체인,

```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
# chain 실행
result = llm.invoke("지구의 자전 주기는?")
```

```python
result.content
```

```
'지구의 자전 주기는 약 24시간, 즉 정확히 23시간 56분 4초입니다. 이 시간을 기준으로 하루라고 부르며, 지구가 한 번 자전하는 동안에 태양이 같은 위치에 다시 나타나는 시간을 태양일이라고 하여 평균적으로 24시간으로 계산됩니다.'

```

```python
from langchain_core.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_template("You are an expert in astronomy. Answer the question. <Question>: {input}")
prompt
```

```
ChatPromptTemplate(input_variables=['input'], input_types={}, partial_variables={}, messages=[HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['input'], input_types={}, partial_variables={}, template='You are an expert in astronomy. Answer the question.: {input}'), additional_kwargs={})])

```

```python
from langchain_openai import ChatOpenAI
llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
# chain 연결 (LCEL)
chain = prompt | llm
# chain 호출
chain.invoke({"input": "지구의 자전 주기는?"})
```

```
AIMessage(content="지구의 자전 주기는 약 24시간입니다. 정확히는 23시간 56분 4초로, 이를 '항성일'이라고 하며, 지구가 자기 축을 한 바퀴 도는 데 걸리는 시간입니다. 일상적으로 우리가 사용하는 24시간은 태양이 하루 동안 지구를 방문하는 데 필요한 시간인 '태양일'입니다. 이 두 주기는 약간의 차이가 있지만, 일반적으로 우리가 일상적으로 사용하는 시간 기준은 태양일을 기준으로 합니다.", additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 115, 'prompt_tokens': 29, 'total_tokens': 144, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-mini-2024-07-18', 'system_fingerprint': 'fp_00428b782a', 'finish_reason': 'stop', 'logprobs': None}, id='run-4685afd4-1fbc-47c8-8054-001d3083f3aa-0', usage_metadata={'input_tokens': 29, 'output_tokens': 115, 'total_tokens': 144, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}})

```

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
# prompt + model + output parserprompt = ChatPromptTemplate.from_template("You are an expert in astronomy. Answer the question. <Question>: {input}")
llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
output_parser = StrOutputParser() # 문자열을 출력으로 파싱하는 output parser
# LCEL chaining "| 으로 체인 구성"
chain = prompt | llm | output_parser
# chain 호출
chain.invoke({"input": "지구의 자전 주기는?"})
```

```
"지구의 자전 주기는 약 24시간입니다. 좀 더 정확하게 말하면, 지구가 한 바퀴 자전하는 데 걸리는 시간은 약 23.93시간이며, 이를 '항성일'이라고 합니다. 그러나 일상적으로 우리가 사용하는 태양일은 약 24시간으로 정의됩니다. 이는 지구가 자전하는 동안 태양의 위치가 다시 원래대로 돌아오는데 필요한 시간을 기준으로 합니다."

```

### 2) Multiple Chains

```python
prompt1 = ChatPromptTemplate.from_template("translates {korean_word} to English.")
prompt2 = ChatPromptTemplate.from_template("explain {english_word} using oxford dictionary to me in Korean.")
llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
chain1 = prompt1 | llm | StrOutputParser()
chain1.invoke({"korean_word":"미래"})
```

```
'The Korean word "미래" translates to "future" in English.'

```

```python
chain2 = (
    {"english_word": chain1}
    | prompt2
    | llm
    | StrOutputParser()
)
chain2.invoke({"korean_word":"미래"})
```

```
'"미래"라는 한국어 단어는 영어로 "future"로 번역됩니다. 옥스퍼드 사전(Oxford Dictionary)에서는 "future"를 다음과 같이 정의합니다:\n\n1. 명사: 어떤 사건이나 상태가 발생할 예정인 시간 또는 기간.\n2. 형용사: 아직 오지 않은, 특히 예상되는 또는 희망하는 상황에 관한 것.\n\n즉, "미래"는 앞으로 다가올 시간을 의미하며, 계획이나 가능성 등을 포함하는 개념이라고 할 수 있습니다.'

```

## 3) Prompt

### 1. PromptTemplate

```python
from langchain_core.prompts import PromptTemplate
# 'name'과 'age'라는 두 개의 변수를 사용하는 프롬프트 템플릿을 정의
template_text = "안녕하세요, 제 이름은 {name}이고, 나이는 {age}살입니다."
# PromptTemplate 인스턴스를 생성
prompt_template = PromptTemplate.from_template(template_text)
# 템플릿에 값을 채워서 프롬프트를 완성
filled_prompt = prompt_template.format(name="홍길동", age=30)
filled_prompt
```

```
'안녕하세요, 제 이름은 홍길동이고, 나이는 30살입니다.'

```

```python
# 문자열 템플릿 결합 (PromptTemplate + PromptTemplate + 문자열)
combined_prompt = (
              prompt_template
              + PromptTemplate.from_template("\n\n아버지를 아버지라 부를 수 없습니다.")
              + "\n\n{language}로 번역해주세요.")
combined_prompt
```

```
PromptTemplate(input_variables=['age', 'language', 'name'], input_types={}, partial_variables={}, template='안녕하세요, 제 이름은 {name}이고, 나이는 {age}살입니다.\n\n아버지를 아버지라 부를 수 없습니다.\n\n{language}로 번역해주세요.')

```

```python
combined_prompt.format(name="홍길동", age=30, language="영어")
```

```
'안녕하세요, 제 이름은 홍길동이고, 나이는 30살입니다.\n\n아버지를 아버지라 부를 수 없습니다.\n\n영어로 번역해주세요.'

```

```python
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
chain = combined_prompt | llm | StrOutputParser()
chain.invoke({"age":30, "language":"영어", "name":"홍길동"})
```

```
"Hello, my name is Hong Gil-dong and I am 30 years old.\n\nI cannot call my father 'father'."

```

### 2. ChatPromptTemplate

```python
# 2-튜플 형태의 메시지 목록으로 프롬프트 생성 (type, content)
from langchain_core.prompts import ChatPromptTemplate
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "이 시스템은 천문학 질문에 답변할 수 있습니다."),
    ("user", "{user_input}"),
])
messages = chat_prompt.format_messages(user_input="태양계에서 가장 큰 행성은 무엇인가요?")
messages
```

```
[SystemMessage(content='이 시스템은 천문학 질문에 답변할 수 있습니다.', additional_kwargs={}, response_metadata={}),
 HumanMessage(content='태양계에서 가장 큰 행성은 무엇인가요?', additional_kwargs={}, response_metadata={})]

```

```python
chain = chat_prompt | llm | StrOutputParser()
chain.invoke({"user_input": "태양계에서 가장 큰 행성은 무엇인가요?"})
```

```
'태양계에서 가장 큰 행성은 목성입니다. 목성은 태양 주위를 도는 지구보다 약 11배 크고, 부피는 지구의 약 1,300배에 달합니다.'

```

### 3. Message

```python
# MessagePromptTemplate 활용
from langchain_core.prompts import SystemMessagePromptTemplate,  HumanMessagePromptTemplate
chat_prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessagePromptTemplate.from_template("이 시스템은 천문학 질문에 답변할 수 있습니다."),
        HumanMessagePromptTemplate.from_template("{user_input}"),
    ]
)
messages = chat_prompt.format_messages(user_input="태양계에서 가장 큰 행성은 무엇인가요?")
messages
```

```
[SystemMessage(content='이 시스템은 천문학 질문에 답변할 수 있습니다.', additional_kwargs={}, response_metadata={}),
 HumanMessage(content='태양계에서 가장 큰 행성은 무엇인가요?', additional_kwargs={}, response_metadata={})]

```

```python
chain = chat_prompt | llm | StrOutputParser()
chain.invoke({"user_input": "태양계에서 가장 큰 행성은 무엇인가요?"})
```

```
'태양계에서 가장 큰 행성은 목성입니다. 목성은 질량, 부피, 지름 등 여러 측면에서 가장 큰 행성으로 알려져 있습니다.'

```

## 4) Model Parameter

### 1. 모델 클래스 유형

- LLM - 단일 요청에 대한 복잡한 출력

```python
from langchain_openai import OpenAI
llm = OpenAI()
llm.invoke("한국의 대표적인 관광지 3군데를 추천해주세요.")
```

```
'\n1. 경복궁 - 서울의 중심지인 종로구에 위치한 경복궁은 조선 왕조의 궁궐로서 한국의 전통적인 건축물과 문화를 간직하고 있는 곳입니다. 궁궐 내부에는 박물관과 전시관이 있어서 한국의 역사와 문화를 배울 수 있으며, 아름다운 정원과 화려한 궁궐 건물들을 감상할 수 있습니다.\n\n2. 제주도 - 한국의 남쪽 끝에 위치한 제주도는 푸른 바다와 화산섬으로 유명한 곳입니다. 제주도에는 다양한 자연 경관과 문화 유적지가 있어서 관광객들의 관심을 끌고 있으며, 맛있는 해산'

```

- ChatModel - 사용자와 지속적으로 상호작용

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
chat = ChatOpenAI()
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "이 시스템은 여행 전문가입니다."),
    ("user", "{user_input}"),
])
chain = chat_prompt | chat
chain.invoke({"user_input": "안녕하세요? 한국의 대표적인 관광지 3군데를 추천해주세요."})
```

```
AIMessage(content='안녕하세요! 한국의 대표적인 관광지 3군데를 추천드리겠습니다.\n\n1. 경복궁 (Gyeongbokgung Palace): 서울에 위치한 경복궁은 조선 시대에 건립된 궁전으로, 한국의 역사와 전통을 경험할 수 있는 곳입니다. 아름다운 건물과 정원을 구경하며 한국의 저력을 느낄 수 있습니다.\n\n2. 제주도 (Jeju Island): 제주도는 한국의 여행지 중 가장 인기 있는 곳으로 자연 경관과 문화적인 매력을 동시에 즐길 수 있는 곳입니다. 한라산 등정대, 성산일출봉, 용두암 등 다양한 관광 명소가 있습니다.\n\n3. 경주 (Gyeongju): 경주는 고려 시대의 수도로 불리는 역사적인 도시로, 다양한 유적지와 문화재가 있는 곳으로 유명합니다. 석굴암, 첨성대, 불국사 등을 방문하여 한국의 역사를 체험해보세요.\n\n이 세 곳은 한국의 다양한 매력을 경험할 수 있는 대표적인 관광지입니다. 즐거운 여행 되시길 바랍니다!', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 392, 'prompt_tokens': 59, 'total_tokens': 451, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-3.5-turbo-0125', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None}, id='run-a5734925-d00a-4aa7-b8ad-717a7470e8ec-0', usage_metadata={'input_tokens': 59, 'output_tokens': 392, 'total_tokens': 451, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}})

```

### 2. 모델 파라미터 설정

- 모델 파라미터 종류
  - temperature: 생성된 텍스트의 다양성 조정
  - max_tokens: 생성할 최대 토큰 수
  - top_p: 생성 과정의 특정 확률 분포 내에서 상위 P%의 토큰만 고려
  - frequency_penalty: 이미 등장한 단어의 재등장 확률
  - presence_penalty: 새로운 단어의 도입을 장려
  - stop: 특정 단어, 구절이 나온 경우 생성을 정지
- 모델에 직접 파라미터를 전달 (모델 생성 시점)

```python
from langchain_openai import ChatOpenAI
# 모델 파라미터 설정
params = {
    "temperature": 0.7,         # 생성된 텍스트의 다양성 조정
     "max_tokens": 100,          # 생성할 최대 토큰 수
     "frequency_penalty": 0.5,   # 이미 등장한 단어의 재등장 확률
     "presence_penalty": 0.5,    # 새로운 단어의 도입을 장려
     "stop": ["\n"]              # 정지 시퀀스 설정
     }
# 모델 인스턴스를 생성할 때 설정
model = ChatOpenAI(model="gpt-3.5-turbo-0125", **params)
# 모델 호출
question = "태양계에서 가장 큰 행성은 무엇인가요?"
response = model.invoke(input=question)
# 전체 응답 출력
print(response)
```

```
content='태양계에서 가장 큰 행성은 목성입니다. 목성은 지름이 약 142,984km로 태양계에서 가장 큰 행성으로 알려져 있습니다.' additional_kwargs={'refusal': None} response_metadata={'token_usage': {'completion_tokens': 58, 'prompt_tokens': 29, 'total_tokens': 87, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-3.5-turbo-0125', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None} id='run-62cc13b2-53c8-4f7f-a9de-66a781d133bf-0' usage_metadata={'input_tokens': 29, 'output_tokens': 58, 'total_tokens': 87, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}}

```

- 모델에 직접 파라미터를 전달 (모델 호출 시점)

```python
# 모델 파라미터 설정
params = {
    "temperature": 0.7,         # 생성된 텍스트의 다양성 조정
    "max_tokens": 10,          # 생성할 최대 토큰 수
    }
# 모델 인스턴스를 호출할 때 전달
response = model.invoke(input=question, **params)
# 문자열 출력
print(response.content)
```

```
태양계에서 가장 큰

```

- 모델에 추가적인 파라미터를 전달
  - bind 메서드를 사용

```python
from langchain_core.prompts import ChatPromptTemplate
prompt = ChatPromptTemplate.from_messages([
    ("system", "이 시스템은 천문학 질문에 답변할 수 있습니다."),
    ("user", "{user_input}"),
])
model = ChatOpenAI(model="gpt-3.5-turbo-0125", max_tokens=100)
messages = prompt.format_messages(user_input="태양계에서 가장 큰 행성은 무엇인가요?")
before_answer = model.invoke(messages)
# binding 이전 출력
print(before_answer)
# 모델 호출 시 추가적인 인수를 전달하기 위해 bind 메서드 사용 (응답의 최대 길이를 10 토큰으로 제한)
chain = prompt | model.bind(max_tokens=10)
after_answer = chain.invoke({"user_input": "태양계에서 가장 큰 행성은 무엇인가요?"})
# binding 이후 출력
print(after_answer)
```

```
content='태양계에서 가장 큰 행성은 목성입니다. 목성은 행성 중 가장 큰 질량을 가지고 있으며, 지름과 부피 모두에서 가장 큰 행성입니다.' additional_kwargs={'refusal': None} response_metadata={'token_usage': {'completion_tokens': 65, 'prompt_tokens': 58, 'total_tokens': 123, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-3.5-turbo-0125', 'system_fingerprint': None, 'finish_reason': 'stop', 'logprobs': None} id='run-a91bf86f-1ddc-4521-8f11-b99a2e2dec92-0' usage_metadata={'input_tokens': 58, 'output_tokens': 65, 'total_tokens': 123, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}}
content='태양계에서 가장 큰' additional_kwargs={'refusal': None} response_metadata={'token_usage': {'completion_tokens': 10, 'prompt_tokens': 58, 'total_tokens': 68, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-3.5-turbo-0125', 'system_fingerprint': None, 'finish_reason': 'length', 'logprobs': None} id='run-bdbb73a7-265d-42ce-8ea7-8f1f480e3d9f-0' usage_metadata={'input_tokens': 58, 'output_tokens': 10, 'total_tokens': 68, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}}

```

## 5) Output Parsers

### 1. CSV Parser

```python
from langchain_core.output_parsers import CommaSeparatedListOutputParser
output_parser = CommaSeparatedListOutputParser()
format_instructions = output_parser.get_format_instructions()
print(format_instructions)
```

```
Your response should be a list of comma separated values, eg: `foo, bar, baz` or `foo,bar,baz`

```

```python
from langchain_core.prompts import PromptTemplate
prompt = PromptTemplate(
    template="List five {subject}.\n{format_instructions}",
    input_variables=["subject"],
    partial_variables={"format_instructions": format_instructions},
)
llm = ChatOpenAI(model="gpt-3.5-turbo-0125", temperature=0)
chain = prompt | llm | output_parser
chain.invoke({"subject": "popular Korean cuisine"})
```

```
['Bibimbap', 'Kimchi', 'Bulgogi', 'Japchae', 'Tteokbokki']

```

### 2. JSON Parser

```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field
# 자료구조 정의 (pydantic)
class CusineRecipe(BaseModel):
    name: str = Field(description="name of a cuisine")
    recipe: str = Field(description="recipe to cook the cuisine")
```

```python
# 출력 파서 정의
output_parser = JsonOutputParser(pydantic_object=CusineRecipe)
format_instructions = output_parser.get_format_instructions()
print(format_instructions)
```

```
The output should be formatted as a JSON instance that conforms to the JSON schema below.

As an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}
the object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.

Here is the output schema:
```

{"properties": {"name": {"title": "Name", "description": "name of a cuisine", "type": "string"}, "recipe": {"title": "Recipe", "description": "recipe to cook the cuisine", "type": "string"}}, "required": ["name", "recipe"]}

```

```

```python
# prompt 구성
prompt = PromptTemplate(
    template="Answer the user query.\n{format_instructions}\n{query}\n",
    input_variables=["query"],
    partial_variables={"format_instructions": format_instructions},
)
print(prompt)
```

````
input_variables=['query'] input_types={} partial_variables={'format_instructions': 'The output should be formatted as a JSON instance that conforms to the JSON schema below.\n\nAs an example, for the schema {"properties": {"foo": {"title": "Foo", "description": "a list of strings", "type": "array", "items": {"type": "string"}}}, "required": ["foo"]}\nthe object {"foo": ["bar", "baz"]} is a well-formatted instance of the schema. The object {"properties": {"foo": ["bar", "baz"]}} is not well-formatted.\n\nHere is the output schema:\n```\n{"properties": {"name": {"title": "Name", "description": "name of a cuisine", "type": "string"}, "recipe": {"title": "Recipe", "description": "recipe to cook the cuisine", "type": "string"}}, "required": ["name", "recipe"]}\n```'} template='Answer the user query.\n{format_instructions}\n{query}\n'

````

```python
chain = prompt | model | output_parser
chain.invoke({"query": "Let me know how to cook Bibimbap"})
```

```
{'name': 'Bibimbap',
 'recipe': 'To cook Bibimbap, start by cooking short-grain rice according to package instructions. While the rice is cooking, prepare the toppings such as sautéed vegetables (carrots, spinach, mushrooms, bean sprouts), marinated protein (beef, chicken, tofu), and fried eggs. To assemble, place a serving of rice in a bowl, arrange the toppings on top, and top with a fried egg'}

```

# Gymnasium을 활용한 강화학습

생성일: 2025년 12월 15일 오후 2:04
상태: 공사 중
태그: 인공지능, 파이썬, 강화학습, DQN, Gymnasium

## 강화학습이란?

- 강화학습은 머신러닝의 한 유형으로, 에이전트, 즉 AI 모델이 환경과의 상호작용을 통해 최적의 행동을 학습한다.
- 라벨링된 데이터에 의존하는 것이 아닌, 에이전트의 작업에 따라 보상과 불이익을 조절하여 학습시킨다.
- 실제 동물의 학습 능력을 모방한 머신러닝 유형이다.

### 종류

- 강화학습도 에이전트에게 미리 환경에 대한 설명을 할지, 안 할지에 따라 MB Algorithm과 MF Algorithm으로 나눈다.
- **MB(Model-Based) Algorithm**
  - 에이전트에게 환경에 대한 설명을 미리 진행하는 방식, 환경에 대한 설명을 Model로 가지는 방식이다.
  - 모델을 사용하면 에이전트가 실제로 행동하기 전에 행동의 결과를 예측할 수 있으므로 보다 계획적이고 전략적인 접근이 가능하다.
- **MF(Model-Free) Algorithm**
  - 에이전트에게 환경에 대한 설명을 미리 진행하지 않는 방식, 환경 파악을 위해서 탐사를 진행하는 특징이 있다.
  - 탐사는 시행착오를 통해 보상 합의 기대값을 최대로 하는 행동(Policy Function)을 찾는 것을 목표로 하여 진행된다.
    이 페이지에서는 이 Algorithm을 사용할 예정이다.

### **강화 학습 기법**

- 목표는 항상 보상을 극대화하는 것이지만, 이를 위한 다양한 전략과 알고리즘, 즉 기법들이 존재한다.
  여기에서는 종류와 간단한 설명만 진행하겠다.
- **Q-러닝**
  - 가장 흔한 MF Algorithm이며, 행동에 대한 품질 점수(Q값)가 나열되며 이 값들을 기반으로 최적의 점수를 학습한다.
- **SARSA(State-Action-Reward-State-Action)**
  - 이 방법은 Q-러닝과 매우 유사하지만, 현재 따르고 있는 정책에 따라 Q값의 나열을 업데이트하는 방식으로, 설정된 정책을 기반으로 동작한다는 차이가 있다.
- **딥 Q-네트워크(DQN)**
  - 이릅에 포함된 ‘딥’이라는 이름에서 알 수 있듯 심층 신경망을 이용하여 Q값의 나열을 대체하는 방식이다. 심층 신경망이 새로운 상태를 살펴보고 Q-값을 추정하며 진행되며, 이 페이지에서 소개할 예시에서도 이 방식을 사용할 예정이다.
- **정책 경사 방법**
  - 이 방식은 주로 분류 문제를 푸는 강화학습으로 볼 수 있으며, 특정 상태에서 가장 좋은 행동을 판단하는 것이다. 어떤 상태에서의 행동에 대한 확률 값들을 인공 신경망으로 모델링한다.

### 강화학습 개발의 과제와 해결책

- 강화학습 알고리즘 개발을 위해서는 수많은 무작위 예시 적용이 필요하기에, 그 예시를 담당할 데이터 또한 많이 필요하다.
  근데 직접 데이터를 수집하면 시작 단계에서 많은 시간과 비용이 발생하는 문제점이 있다.
- 해당 문제의 해결을 위해 Gymnasium은 강화 학습을 휘한 환경과 학습 알고리즘 간의 광범위한 상호 운용성을 가능하게 하기 위해 바로 사용 가능한 환경 모음, 커스텀 도구 등을 제공한다.
  아래에서 더욱 자세히 다뤄보자.

## Gymnasium 소개

- Gymnasium은 Farama Foundation에서 제공하는 강화 학습 라이브러리로 앞에서 말했듯 강화학습에 필요한 다양한 도구를 제공한다.

### Gymnasium이 제공하는 도구

- **학습 환경(Environment)** : Gymnasium의 핵심 요소로, 강화학습에 필요한 환경들을 제공하여 에이전트가 직접 결정하여 상호작용할 수 있다.
  다양한 종류와 메서드들을 제공하여 Action에 따른 Observations, Reward 등을 쉽게 얻을 수 있다.
- **벡터 환경(Vector Environment)** : 앞서 설명한 일반적인 환경과는 달리, VectorEnv는 독립적으로 실행되는 여러 환경(Env)들의 모음(collection)을 말한다. (벡터로 이루어진 환경인줄;;)
  여러 환경을 병렬로 실행할 수 있게 하여 초당 실행 단계를 극대화하기 때문에 관측치를 필요로 하는 최신 RL 연구에 필요하다.
- **공간(Space)** : AI Agent가 입력으로 받을 Observations, 결정할 Action의 예상 구조를 정의하기 위한 행렬 데이터이다.
- **환경 관리 도구(Registry)** : 단순히 환경을 사용하는 것 뿐만 아니라, 직접 제작하고 저장하기 위한 관리 도구이다.
- **환경 래퍼(Wrappers)** : 보상을 클리핑하거나, 관측값을 정규화하거나, MP4 비디오를 녹화하는 등의 기능을 쉽게 수행하게 하는 도구이다.
- **유틸 함수(Utility functions)** : 래퍼와는 다른, 더 다양한 기능들을 담고 있는 함수들을 제공하여 연구자들을 도울 수 있다.

### 설치

- Gymnasium 을 설치하기 위해서는 Python이 먼저 설치되어 있어야 한다. 개인적으로 Anaconda를 활용해서 Python 환경을 구성하길 바란다.
  하지만 나는 uv를 활용할 예정이다(?)

```bash
pip install gymnasium
```

- 위 코드를 입력하면 Gymnasium을 쉽게 설치할 수 있다.
  하지만 이거를 입력한다고 해서 바로 Gymnasium의 환경을 사용할 수 있는 것은 아니다. Gymnasium에서 환경을 설치하려면 아래와 같이 작성해야 한다.

```bash
pip install gymnasium[classic_control]
```

- 위와 같이 대괄호 안에 환경 이름을 입력해야 환경 실행에 필요한 하위 라이브러리를 모두 포함하여 Gymnasium을 설치한다는 의미가 되기에 원하는 환경에 맞추어 대괄호 안의 값을 입력해야 한다.
- uv를 사용하는 경우에는 아래와 같이 작성해야 정상적인 설치가 가능하다.

```bash
uv add "gymnasium[classic_control]"
```

### 예시 코드

- 아래는 Gymnasium 공식 논문에서 제공하는 예시 코드이다. 하나하나 읽어보며 어떻게 도구들이 쓰였는지 알아보자

```python
import gymnasium as gym

env = gym.make("CartPole-v1", render_mode="human") # CartPole-v1 환경 생성
print(f"Observation Space={env.observation_space}") # 관측 공간의 크기와 범위를 출력
print(f"Action Space={env.action_space}") # 행동 공간의 크기와 범위를 출력

observation, info = env.reset(seed=42)
for _ in range(1000):
    action = env.action_space.sample() # 행동 공간에서 무작위로 행동을 선택
    observation, reward, terminated, truncated, info = env.step(action) # 선택한 행동을 환경에 적용

    if terminated or truncated:
        print("새 에피소드 시작")
        observation, info = env.reset()

env.close() # 천 번동안 CartPole 환경을 실행한 후, 환경을 닫음
```

## References

- https://gymnasium.farama.org/
- https://cloud.google.com/discover/what-is-reinforcement-learning?hl=ko
- https://tutorials.pytorch.kr/intermediate/reinforcement_q_learning.html#id7
- https://arxiv.org/abs/1312.5602
- https://www.themoonlight.io/paper/91e82653-b28c-4328-b05b-dfcb674477be
- https://davinci-ai.tistory.com/31
- https://youtu.be/YLjiXibpEmQ?si=g5V6YQVVlR4w2DmR
- https://coffee-with-me.tistory.com/32

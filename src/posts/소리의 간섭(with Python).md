# 소리의 간섭(with Python)

생성일: 2025년 1월 9일 오후 7:05
상태: 정리 완료
태그: 음향학, 물리, 음악, 파이썬, 파동, 간섭

🚧 이 페이지는 [**파동의 간섭 위키**](https://app.notion.com/p/14a9772c515c8070b30de82f432c930e?pvs=21)에서 참고하여 작성함.

## 소리와 파동

- 소리, 즉 음파는 이름에서도 알 수 있듯이 파동의 종류이다.
  여러 파동의 종류 중에서 소리는 **종파**에 속하는데, 종파는 파동의 진행 방향과 진동방향이 나란한 파동을 말한다.
  여기서는 간단하게 설명하고 추후에 자연 과학 파트에서 자세히 설명하도록 하겠다.
- 종파는 매질이 모인 부분(밀)과 비교적 매질이 적은 부분(소)로 나뉘며, 밀에서 밀 또는, 소에서 소 까지의 거리를 **파장**이라고 한다.

![image.png](/img/soundwave.png)

- 소리도 위와 같은 종파이며, 매질로는 고체, 액체, 기체 전부를 사용할 수 있고 매질에 따라 속도가 변화한다. 고체>액체>기체 순으로 빠르다.
- 소리는 심지어 진행 중에 매질이 바뀌면 음의 높낮이가 달라질 수 있다. 이는 매질이 바뀌면서 파장은 변화하지만, 주기는 변화하지 않아 음정에 변화가 생기는 것이다.

## 파동의 간섭

- 서로 다른 위상의 파동이 만나 진폭이 변화하는 현상을 **파동의 간섭** 이라고 한다.
  크게 두 가지로 나눌 수 있으며, 당연하게도 횡파, 종파 가리지 않고 발생한다.

### 보강 간섭

- 두 파동이 같은 위상(마루와 마루, 골과 골)으로 만날 때, 두 파동이 합쳐진 합성파의 진폭이 커지는 현상을 말한다.

### 상쇄 간섭

- 두 파동이 반대의 위상(마루와 골, 골과 마루)로 만날 때, 두 파동이 합쳐진 합성파의 진폭이 작아지는 현상을 말한다.

![image.png](/img/wave-mix.png)

## 소리의 간섭(맥놀이 현상)

- Beat 현상이라고도 불리며, 서로 다른 주파수(Hz) 값의 소리가 만날 때 주파수의 위상이 시간에 따라 증폭하기도 상쇄하기도 하면서 소리의 크기가 커졌다 작아졌다 하는 현상이다.

![image.png](/img/beat.png)

### 맥놀이 현상 시각화(with Python)

- 위의 그림처럼 직접 python 프로그래밍을 통해 맥놀이 현상을 시각화하여 보자.
- 파형은 sine wave를 사용하고, matplotlib 라이브러리를 이용해 그래프를 그려 시각화 할 예정이다.
  그리고 빠질 수 없는 numpy와 sounddevice 라이브러리로 소리를 직접 재생하여 볼 예정이다.
- 필요한 라이브러리를 먼저 설치하자.

```bash
pip install numpy matplotlib sounddevice
```

- x축을 위한 numpy 배열을 먼저 만들어 보자

```python
duration = 3  # 신호 길이 (초)
sample_rate = 44100  # 샘플링 주파수 (Hz)
t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False) # 시간 축
```

- 그리고 주파수에 맞는 파장, 주기를 가진 함수를 2개 생성한다.
  코드에서는 **레**와 **솔**의 주파수에 맞게 작성하였다.

```python
octave_freq = [131, 139 , 147, 156,  165, 175, 185, 196 , 208, 220, 233 , 247] # 옥타브에 따른 주파수
octave_name = ['도','도#','레','레#','미','파','파#','솔','솔#','라','라#','시'] # 옥타브에 따른 계이름
notes = [2,7]
# np.sign()
wave1 = 0.5 * np.sin(4 * np.pi * octave_freq[notes[0]] * t)  # 첫 번째 파형
wave2 = 0.5 * np.sin(4 * np.pi * octave_freq[notes[1]] * t)  # 두 번째 파형
waves = [wave1, wave2]
```

- 그리고 이 두 함수를 합쳐서 간섭 파형 함수를 만들어준다.

```python
interference_wave = wave1 + wave2 # 간섭 파형
```

- 이제 만든 파형 함수를 x축 배열에 맞게 그려보자
  코드에서는 for문을 사용하여 중복되는 코드를 줄였다.

```python
for i in range(2): # 파형 2개 반복문 돌리기
    plt.subplot(3, 1, i+1)
    plt.plot(t[:1000], waves[i][:1000])
    plt.title(f"파형 {i+1} ({octave_freq[notes[i]]*2} Hz, {octave_name[notes[i]]})")
    plt.xlabel("Time (s)")
    plt.ylabel("Amplitude")

# 간섭 파형
plt.subplot(3, 1, 3)
plt.plot(t[:1000], interference_wave[:1000])
plt.title("간섭 파형(두 파형을 더한 화음)")
plt.xlabel("Time (s)")
plt.ylabel("Amplitude")
```

- 마지막으로 음을 실행하는 코드를 작성해 주면 끝이다.

```python
# 소리 재생
print("Playing Interference Wave...")
sd.play(interference_wave, sample_rate)
sd.wait()
print("Done!")
```

- 본 문서에서는 생략된 코드가 있기 때문에 해당 코드를 올린 깃허브 링크를 알려주도록 하겠다.

[https://github.com/rrayy-25809/soundwave](https://github.com/rrayy-25809/soundwave)

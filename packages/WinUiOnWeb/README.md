# WinUI on Web

> WinUI 3 控件在浏览器中运行 — 基于 Vue 3 + TypeScript + Vite 构建

将 Microsoft WinUI 3 / Windows App SDK 的 Fluent Design 控件带到 Web 端。80+ 个高质量控件，支持 XAML 风格的绑定语法、Light/Dark 主题、国际化。

---

## 目录

- [安装](#安装)
- [快速上手](#快速上手)
- [按需导入](#按需导入)
- [XAML 绑定语法](#xaml-绑定语法)
- [主题系统](#主题系统)
- [国际化](#国际化)
- [CDN 引入](#cdn-引入)
- [控件文档](#控件文档)
  - [布局控件](#布局控件)
  - [按钮控件](#按钮控件)
  - [文本输入控件](#文本输入控件)
  - [选择控件](#选择控件)
  - [进度/状态控件](#进度状态控件)
  - [弹出/浮层控件](#弹出浮层控件)
  - [导航控件](#导航控件)
  - [集合控件](#集合控件)
  - [滚动控件](#滚动控件)
  - [媒体控件](#媒体控件)
  - [日期/时间控件](#日期时间控件)
  - [菜单/命令栏](#菜单命令栏)
  - [其他控件](#其他控件)
  - [运行时工具函数](#运行时工具函数)
- [开发指南](#开发指南)
- [构建产物](#构建产物)

---

## 安装

```bash
npm install winuionweb
```

### 依赖要求

- Vue `^3.5.0`（peer dependency）

---

## 快速上手

### 方式一：全局注册（推荐）

```ts
// main.ts
import { createApp } from 'vue'
import WinUI from 'winuionweb'       // 默认导出 Vue 插件
import 'winuionweb/dist/winuionweb.css'  // 主题样式（按需，入口已自动引入）

const app = createApp(App)
app.use(WinUI, {
  locale: 'zh-CN',   // 可选，默认自动检测浏览器语言
})
app.mount('#app')
```

然后在任意 `.vue` 文件中直接使用标签名：

```vue
<template>
  <StackPanel Spacing="16" Padding="24">
    <TextBlock Text="欢迎使用 WinUI on Web！" FontSize="24" FontWeight="600" />
    <Button Content="点击我" @Click="handleClick" />
    <ToggleSwitch Header="Wi-Fi" v-model:IsOn="wifiEnabled" />
    <Slider v-model:Value="volume" Minimum="0" Maximum="100" Header="音量" />
    <CheckBox Content="同意条款" v-model:IsChecked="agreed" />
  </StackPanel>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const wifiEnabled = ref(true)
const volume = ref(50)
const agreed = ref(false)

const handleClick = () => alert('按钮点击！')
</script>
```

### 方式二：按需导入（Tree-shaking 友好）

```vue
<script setup>
import { Button, StackPanel, TextBlock, ToggleSwitch, Slider, CheckBox } from 'winuionweb'
import { ref } from 'vue'

const wifiEnabled = ref(true)
const volume = ref(50)
const agreed = ref(false)
</script>

<template>
  <StackPanel Spacing="16">
    <TextBlock Text="设置" FontSize="24" />
    <Button Content="保存" />
    <ToggleSwitch Header="Wi-Fi" v-model:IsOn="wifiEnabled" />
    <Slider v-model:Value="volume" Minimum="0" Maximum="100" />
    <CheckBox Content="同意" v-model:IsChecked="agreed" />
  </StackPanel>
</template>
```

---

## XAML 绑定语法

本项目支持在 Vue 模板中使用 XAML 风格的绑定表达式（依赖 `xamlRuntime.ts` 引擎）。

### x:Bind

```vue
<template>
  <StackPanel Spacing="12">
    <TextBlock Text="{x:Bind greeting, Mode=OneWay}" />
    <Slider Value="{x:Bind volume, Mode=TwoWay}" Minimum="0" Maximum="100" />
    <TextBlock Text="{x:Bind formattedMessage, Mode=OneWay}" />
  </StackPanel>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const greeting = ref('Hello, WinUI!')
const volume = ref(50)
const formattedMessage = computed(() => `当前音量：${volume.value}%`)
</script>
```

### ThemeResource / StaticResource

```vue
<Button
  Background="{ThemeResource AccentFillColorDefaultBrush}"
  Content="强调色按钮" />
```

### 事件绑定

XAML 风格的事件名（首字母大写）：

```vue
<Button Click="onSave" Content="保存" />
<CheckBox Checked="onChecked" Unchecked="onUnchecked" />
<Slider ValueChanged="onVolumeChanged" />
<TextBox TextChanged="onTextChanged" />
```

> 也支持 Vue 标准 `@Click` 语法。

---

## 主题系统

支持 Light / Dark / System 三种模式。

### 切换主题

```ts
// 全局主题切换
document.documentElement.classList.add('theme-dark')   // 深色模式
document.documentElement.classList.remove('theme-dark') // 浅色模式

// 或者使用 ThemeWrapper 组件局部包裹
```

```vue
<template>
  <ThemeWrapper theme="dark">
    <Button Content="深色区域的按钮" />
  </ThemeWrapper>
</template>
```

> 入口文件 `src/index.ts` 已自动导入 `theme.css`，无需手动引入。

---

## 国际化

内置 `en-US` 和 `zh-CN` 支持，自动检测浏览器语言。

### 自定义配置

```ts
app.use(WinUI, {
  locale: 'zh-CN',
  extraResources: {
    'zh-CN': {
      'my.custom.key': '自定义文本'
    }
  }
})
```

### 模板中使用

```vue
<template>
  <TextBlock Text="{x:Bind $t('my.custom.key'), Mode=OneTime}" />
</template>

<!-- 或直接在模板中使用 -->
<TextBlock :Text="$t('my.custom.key')" />
```

### 组件内使用

```ts
import { useI18n } from 'winuionweb'

const { t } = useI18n()
console.log(t('my.custom.key'))
```

---

## CDN 引入

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WinUI Demo</title>
  <!-- Vue -->
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <!-- WinUI 样式 -->
  <link rel="stylesheet" href="https://unpkg.com/winuionweb/dist/winuionweb.css" />
</head>
<body>
  <div id="app">
    <win-stack-panel spacing="16" padding="24">
      <win-text-block text="Hello from WinUI!" font-size="24"></win-text-block>
      <win-button content="点击我"></win-button>
    </win-stack-panel>
  </div>

  <script src="https://unpkg.com/winuionweb/dist/winuionweb.iife.js"></script>
  <script>
    const { createApp } = Vue
    const app = createApp({})

    // 注册需要用到的组件
    app.component('win-stack-panel', WinUIonWeb.StackPanel)
    app.component('win-text-block', WinUIonWeb.TextBlock)
    app.component('win-button', WinUIonWeb.Button)

    app.mount('#app')
  </script>
</body>
</html>
```

---

## 控件文档

### 布局控件

用于页面结构和布局的基础容器。

#### `<Grid>`

行列网格布局，对应 WinUI `Grid`。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `RowDefinitions` | `string` | `"*"` | 行定义，如 `"Auto,*,2*"` |
| `ColumnDefinitions` | `string` | `"*"` | 列定义，如 `"200,*,Auto"` |
| `ColumnSpacing` | `number` | `0` | 列间距 |
| `RowSpacing` | `number` | `0` | 行间距 |
| `Padding` | `string` | `""` | 内边距，如 `"12"` 或 `"12,8"` |

**附加属性：** `Grid.Row`, `Grid.Column`, `Grid.RowSpan`, `Grid.ColumnSpan`

```vue
<Grid ColumnDefinitions="Auto,*,200" RowDefinitions="Auto,*" ColumnSpacing="8" RowSpacing="8">
  <TextBlock Grid.Row="0" Grid.Column="0" Text="标题" />
  <TextBox Grid.Row="0" Grid.Column="1" PlaceholderText="输入内容" />
  <Button Grid.Row="0" Grid.Column="2" Content="搜索" />
  <ListView Grid.Row="1" Grid.ColumnSpan="3" :ItemsSource="items" />
</Grid>
```

#### `<StackPanel>`

垂直或水平堆叠布局。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Orientation` | `"Vertical" \| "Horizontal"` | `"Vertical"` | 排列方向 |
| `Spacing` | `number` | `0` | 子元素间距 |
| `Padding` | `string` | `""` | 内边距 |
| `HorizontalAlignment` | `string` | `""` | 水平对齐方式 |
| `VerticalAlignment` | `string` | `""` | 垂直对齐方式 |

```vue
<StackPanel Orientation="Horizontal" Spacing="8">
  <Button Content="新建" />
  <Button Content="打开" />
  <Button Content="保存" />
</StackPanel>
```

#### `<RelativePanel>`

相对定位布局，子元素可相对于其他元素或面板边缘定位。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Padding` | `string` | 内边距 |

**附加属性：** `RelativePanel.AlignLeftWith`, `RelativePanel.AlignRightWith`, `RelativePanel.AlignTopWith`, `RelativePanel.AlignBottomWith`, `RelativePanel.LeftOf`, `RelativePanel.RightOf`, `RelativePanel.Above`, `RelativePanel.Below`, `RelativePanel.AlignHorizontalCenterWith`, `RelativePanel.AlignVerticalCenterWith`

```vue
<RelativePanel>
  <Button RelativePanel.AlignLeftWith="panel" Content="左" />
  <Button RelativePanel.AlignRightWith="panel" Content="右" />
  <Button RelativePanel.Below="leftButton" Content="下方" />
</RelativePanel>
```

#### `<VariableSizedWrapGrid>`

可变大小自动换行网格。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `ItemWidth` | `number` | `100` | 网格单元宽度 |
| `ItemHeight` | `number` | `100` | 网格单元高度 |
| `Orientation` | `"Vertical" \| "Horizontal"` | `"Vertical"` | 排列方向 |
| `MaximumRowsOrColumns` | `number` | `-1` | 最大行/列数 |

**附加属性：** `VariableSizedWrapGrid.ColumnSpan`, `VariableSizedWrapGrid.RowSpan`

#### `<Border>`

装饰容器，添加边框、背景、圆角。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Background` | `string` | 背景色 |
| `BorderBrush` | `string` | 边框颜色 |
| `BorderThickness` | `string` | 边框厚度，如 `"1"` 或 `"1,0,1,0"` |
| `CornerRadius` | `string` | 圆角半径，如 `"4"` 或 `"4,0,4,0"` |
| `Padding` | `string` | 内边距 |
| `Width` | `string` | 宽度 |
| `Height` | `string` | 高度 |

```vue
<Border Background="{ThemeResource CardBackgroundFillColorDefaultBrush}"
        CornerRadius="8" Padding="16">
  <TextBlock Text="带边框的卡片内容" />
</Border>
```

#### `<Canvas>`

绝对定位画布。

**附加属性：** `Canvas.Left`, `Canvas.Top`, `Canvas.ZIndex`

#### `<Viewbox>`

缩放子元素以填充可用空间。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Stretch` | `"None" \| "Fill" \| "Uniform" \| "UniformToFill"` | `"Uniform"` | 缩放模式 |
| `StretchDirection` | `"UpOnly" \| "DownOnly" \| "Both"` | `"Both"` | 缩放方向 |

#### `<Rectangle>`

矩形图形。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Fill` | `string` | 填充色 |
| `Stroke` | `string` | 描边色 |
| `StrokeThickness` | `string` | 描边宽度 |
| `RadiusX` / `RadiusY` | `string` | 圆角半径 |
| `Width` / `Height` | `string` | 尺寸 |

---

### 按钮控件

#### `<Button>`

标准按钮。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Content` | `string` | `""` | 按钮文本 |
| `IsEnabled` | `boolean` | `true` | 是否启用 |
| `Style` | `"Accent" \| ""` | `""` | 按钮样式（Accent 为主色调） |
| `Background` | `string` | `""` | 背景色 |
| `Foreground` | `string` | `""` | 文字颜色 |

**事件：** `@Click`

**XAML 子属性：** `<Button.Flyout>` — 附加 Flyout

```vue
<Button Content="主按钮" @Click="onSave" />
<Button Content="强调按钮" Style="Accent" />
<Button :IsEnabled="isFormValid" Content="提交" />

<!-- 带 Flyout 的按钮 -->
<Button Content="更多选项">
  <Button.Flyout>
    <Flyout>
      <StackPanel Spacing="8">
        <Button Content="选项一" />
        <Button Content="选项二" />
      </StackPanel>
    </Flyout>
  </Button.Flyout>
</Button>
```

#### `<ToggleButton>`

开关按钮，可在两种状态间切换。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 按钮文本 |
| `IsChecked` | `boolean` | 是否选中（支持 v-model） |
| `IsEnabled` | `boolean` | 是否启用 |

**事件：** `@Click`, `@Checked`, `@Unchecked`

```vue
<ToggleButton v-model:IsChecked="isToggled" Content="切换按钮" />
```

#### `<RepeatButton>`

按住持续触发点击事件的按钮。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 按钮文本 |
| `Delay` | `number` | 首次重复前的延迟（ms） |
| `Interval` | `number` | 重复间隔（ms） |

**事件：** `@Click`

```vue
<RepeatButton Content="长按增加" :Delay="500" :Interval="100" @Click="count++" />
```

#### `<HyperlinkButton>`

超链接样式的按钮。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 链接文本 |
| `NavigateUri` | `string` | 导航 URL |
| `IsEnabled` | `boolean` | 是否启用 |

**事件：** `@Click`

```vue
<HyperlinkButton Content="了解更多" @Click="openLink" />
```

#### `<DropDownButton>`

下拉按钮，点击展开菜单。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 按钮文本 |
| `IsEnabled` | `boolean` | 是否启用 |

**XAML 子属性：** `<DropDownButton.Flyout>`, `<DropDownButton.Content>`

```vue
<DropDownButton Content="文件">
  <DropDownButton.Flyout>
    <MenuFlyout>
      <MenuFlyoutItem Text="新建" />
      <MenuFlyoutItem Text="打开" />
      <MenuFlyoutItem Text="保存" />
    </MenuFlyout>
  </DropDownButton.Flyout>
</DropDownButton>
```

#### `<SplitButton>`

分裂按钮，主按钮 + 下拉箭头。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 按钮文本 |
| `IsEnabled` | `boolean` | 是否启用 |

**XAML 子属性：** `<SplitButton.Flyout>`

#### `<ToggleSplitButton>`

可切换状态的分裂按钮。

**XAML 子属性：** `<ToggleSplitButton.Flyout>`

#### `<AppBarButton>`

应用栏按钮，带图标和标签。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Label` | `string` | 标签文本 |
| `Icon` | `string` | 图标名称或 Glyph |
| `IsEnabled` | `boolean` | 是否启用 |
| `IsCompact` | `boolean` | 是否紧凑模式 |
| `LabelPosition` | `"Default" \| "Collapsed"` | 标签位置 |

#### `<AppBarToggleButton>`

可切换的应用栏按钮。

#### `<AppBarSeparator>`

应用栏分割线。

---

### 文本输入控件

#### `<TextBlock>`

文本显示控件（不可编辑）。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Text` | `string` | `""` | 显示文本 |
| `FontSize` | `number` | `14` | 字体大小 |
| `FontWeight` | `string` | `"Normal"` | 字重，如 `"Bold"`, `"SemiBold"` |
| `FontStyle` | `string` | `"Normal"` | 字体样式 |
| `TextWrapping` | `string` | `"Wrap"` | 换行模式 |
| `TextTrimming` | `string` | `"None"` | 文本裁剪方式 |
| `Foreground` | `string` | `""` | 文本颜色 |
| `HorizontalAlignment` | `string` | `""` | 水平对齐 |
| `VerticalAlignment` | `string` | `""` | 垂直对齐 |
| `MaxLines` | `number` | `0` | 最大行数 |
| `LineHeight` | `number` | `0` | 行高 |

```vue
<TextBlock Text="普通文本" />
<TextBlock Text="大标题" FontSize="28" FontWeight="Bold" />
<TextBlock Text="次要文字" Foreground="{ThemeResource TextFillColorSecondaryBrush}" />
```

#### `<TextBox>`

单行/多行文本输入。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Text` | `string` | 文本内容（支持 v-model） |
| `PlaceholderText` | `string` | 占位提示 |
| `IsReadOnly` | `boolean` | 是否只读 |
| `MaxLength` | `number` | 最大字符数 |
| `AcceptsReturn` | `boolean` | 是否接受回车（多行） |
| `TextWrapping` | `string` | 换行模式 |

**事件：** `@TextChanged`

```vue
<TextBox v-model:Text="name" PlaceholderText="请输入姓名" />
<TextBox v-model:Text="description" AcceptsReturn MaxLength="500" />
```

#### `<RichEditBox>`

富文本编辑框。

#### `<RichTextBlock>`

富文本显示控件。

#### `<PasswordBox>`

密码输入框。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Password` | `string` | 密码内容（支持 v-model） |
| `PlaceholderText` | `string` | 占位提示 |
| `IsPasswordRevealButtonEnabled` | `boolean` | 是否显示密码可见按钮 |
| `MaxLength` | `number` | 最大字符数 |

```vue
<PasswordBox v-model:Password="pwd" PlaceholderText="请输入密码" />
```

#### `<AutoSuggestBox>`

自动建议输入框。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Text` | `string` | 输入文本 |
| `PlaceholderText` | `string` | 占位提示 |
| `ItemsSource` | `string[]` | 建议列表 |
| `IsReadOnly` | `boolean` | 是否只读 |

**事件：** `@TextChanged`, `@QuerySubmitted`, `@SuggestionChosen`

```vue
<AutoSuggestBox
  v-model:Text="query"
  :ItemsSource="suggestions"
  PlaceholderText="搜索..."
  @TextChanged="onSearch" />
```

#### `<NumberBox>`

数字输入框。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Value` | `number` | `0` | 数值（支持 v-model） |
| `Minimum` | `number` | `0` | 最小值 |
| `Maximum` | `number` | `100` | 最大值 |
| `SmallChange` | `number` | `1` | 步进值 |
| `LargeChange` | `number` | `10` | 大步进值 |
| `PlaceholderText` | `string` | `""` | 占位提示 |

```vue
<NumberBox v-model:Value="quantity" Minimum="1" Maximum="99" />
```

---

### 选择控件

#### `<CheckBox>`

复选框。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 标签文本 |
| `IsChecked` | `boolean \| null` | 选中状态（支持 v-model；null 表示三态不确定） |
| `IsThreeState` | `boolean` | 是否启用三态 |
| `IsEnabled` | `boolean` | 是否启用 |

**事件：** `@Checked`, `@Unchecked`, `@Click`

```vue
<CheckBox Content="记住我" v-model:IsChecked="remember" />
<CheckBox Content="全选" :IsThreeState="true" v-model:IsChecked="selectAll" />
```

#### `<RadioButton>`

单选按钮。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 标签文本 |
| `IsChecked` | `boolean` | 是否选中（支持 v-model） |
| `GroupName` | `string` | 分组名 |

```vue
<RadioButton Content="选项 A" GroupName="group1" v-model:IsChecked="selected === 'A'" />
<RadioButton Content="选项 B" GroupName="group1" v-model:IsChecked="selected === 'B'" />
```

#### `<RadioButtons>`

单选按钮组。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Header` | `string` | 标题 |
| `Items` | `{ Content: string; Value: any }[]` | 选项列表 |
| `SelectedItem` | `any` | 当前选中项 |

#### `<ToggleSwitch>`

开关控件。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Header` | `string` | 标题文本 |
| `IsOn` | `boolean` | 开关状态（支持 v-model） |
| `IsEnabled` | `boolean` | 是否启用 |

**事件：** `@Toggled`

```vue
<ToggleSwitch Header="蓝牙" v-model:IsOn="bluetoothOn" />
```

#### `<Slider>`

滑块选择器。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Value` | `number` | `0` | 当前值（支持 v-model） |
| `Minimum` | `number` | `0` | 最小值 |
| `Maximum` | `number` | `100` | 最大值 |
| `StepFrequency` | `number` | `0` | 步进频率 |
| `TickFrequency` | `number` | `0` | 刻度频率 |
| `TickPlacement` | `"None" \| "Outside" \| "Inline"` | `"None"` | 刻度位置 |
| `Header` | `string` | `""` | 标题文本 |
| `IsEnabled` | `boolean` | `true` | 是否启用 |
| `Orientation` | `"Horizontal" \| "Vertical"` | `"Horizontal"` | 方向 |

**事件：** `@ValueChanged`

```vue
<Slider v-model:Value="brightness" Minimum="0" Maximum="100" Header="亮度" TickFrequency="10" TickPlacement="Outside" />
```

#### `<Rating>`

评分控件。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Value` | `number` | `0` | 评分值（支持 v-model） |
| `MaxRating` | `number` | `5` | 最大星数 |
| `IsReadOnly` | `boolean` | `false` | 是否只读 |
| `PlaceholderValue` | `number` | `0` | 占位值 |

#### `<ColorPicker>`

颜色选择器。

#### `<ComboBox>`

下拉选择框。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `any[]` | 数据源 |
| `SelectedItem` | `any` | 选中项（支持 v-model） |
| `SelectedIndex` | `number` | 选中索引 |
| `PlaceholderText` | `string` | 占位提示 |
| `Header` | `string` | 标题 |
| `IsEnabled` | `boolean` | 是否启用 |

```vue
<ComboBox
  v-model:SelectedItem="selectedColor"
  :ItemsSource="['红色', '绿色', '蓝色']"
  Header="选择颜色"
  PlaceholderText="请选择..."
/>
```

#### `<ListBox>`

列表选择框。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `any[]` | 数据源 |
| `SelectedItem` | `any` | 选中项（支持 v-model） |

---

### 进度/状态控件

#### `<ProgressBar>`

进度条。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Value` | `number` | `0` | 当前进度 |
| `Minimum` | `number` | `0` | 最小值 |
| `Maximum` | `number` | `100` | 最大值 |
| `IsIndeterminate` | `boolean` | `false` | 是否不确定模式（无限循环动画） |
| `ShowError` | `boolean` | `false` | 错误状态 |
| `ShowPaused` | `boolean` | `false` | 暂停状态 |

```vue
<ProgressBar :Value="uploadProgress" />
<ProgressBar :IsIndeterminate="true" />
```

#### `<ProgressRing>`

圆形进度指示器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `IsActive` | `boolean` | 是否活动（旋转动画） |
| `Foreground` | `string` | 前景色 |

```vue
<ProgressRing :IsActive="isLoading" />
```

#### `<InfoBar>`

信息栏。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Title` | `string` | `""` | 标题 |
| `Message` | `string` | `""` | 消息内容 |
| `Severity` | `"Informational" \| "Success" \| "Warning" \| "Error"` | `"Informational"` | 严重程度 |
| `IsOpen` | `boolean` | `false` | 是否显示 |
| `IsClosable` | `boolean` | `true` | 是否可关闭 |
| `ActionButton` | `string` | `""` | 操作按钮文本 |

**事件：** `@CloseButtonClick`

```vue
<InfoBar
  Title="保存成功"
  Message="文件已保存到云端"
  Severity="Success"
  :IsOpen="showSuccess" />
```

#### `<InfoBadge>`

徽章指示器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Value` | `string \| number` | 徽章值 |
| `IconSource` | `object` | 图标源 |

#### `<PipsPager>`

翻页指示器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `NumberOfPages` | `number` | 总页数 |
| `SelectedPageIndex` | `number` | 当前页索引（支持 v-model） |

---

### 弹出/浮层控件

#### `<Flyout>`

轻量级弹出浮层。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Placement` | `"Top" \| "Bottom" \| "Left" \| "Right"` | 弹出方向 |
| `Theme` | `string` | 主题覆盖 |

```vue
<Button Content="显示 Flyout">
  <Button.Flyout>
    <Flyout>
      <StackPanel Spacing="8" Padding="12">
        <TextBlock Text="Flyout 内容" FontSize="16" FontWeight="SemiBold" />
        <Button Content="操作" />
      </StackPanel>
    </Flyout>
  </Button.Flyout>
</Button>
```

#### `<MenuFlyout>`

菜单弹出浮层。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Placement` | `"Top" \| "Bottom" \| "Left" \| "Right"` | 弹出方向 |

#### `<ContentDialog>`

模态对话框。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Title` | `string` | `""` | 对话框标题 |
| `Content` | `string` | `""` | 对话框内容文本 |
| `IsOpen` | `boolean` | `false` | 是否显示（支持 v-model） |
| `PrimaryButtonText` | `string` | `""` | 主按钮文本 |
| `SecondaryButtonText` | `string` | `""` | 次按钮文本 |
| `CloseButtonText` | `string` | `""` | 关闭按钮文本 |
| `IsPrimaryButtonEnabled` | `boolean` | `true` | 主按钮是否可用 |

**事件：** `@PrimaryButtonClick`, `@SecondaryButtonClick`, `@CloseButtonClick`

```vue
<ContentDialog
  v-model:IsOpen="showDialog"
  Title="确认删除"
  Content="确定要删除此文件吗？此操作不可撤销。"
  PrimaryButtonText="删除"
  SecondaryButtonText="取消"
  @PrimaryButtonClick="confirmDelete" />
```

#### `<TeachingTip>`

教学提示气泡。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Title` | `string` | 标题 |
| `Subtitle` | `string` | 副标题 |
| `IsOpen` | `boolean` | 是否显示（支持 v-model） |
| `Placement` | `string` | 弹出方向 |
| `Target` | `HTMLElement` | 锚点元素 |

**XAML 子属性：** `<TeachingTip.HeroContent>`, `<TeachingTip.Content>`, `<TeachingTip.IconSource>`

#### `<ToolTip>`

工具提示。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Content` | `string` | 提示文本 |
| `Placement` | `string` | 弹出方向 |

```vue
<ToolTip Content="这是一个提示" Placement="Top">
  <Button Content="悬停查看提示" />
</ToolTip>
```

#### `<Popup>`

通用弹出层。

| 属性 | 类型 | 说明 |
|------|------|------|
| `IsOpen` | `boolean` | 是否显示 |
| `Placement` | `string` | 弹出方向 |

#### `<CommandBarFlyout>`

命令栏弹出浮层。

---

### 导航控件

#### `<NavigationView>`

导航视图，提供侧边栏导航结构。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `MenuItems` | `NavigationItem[]` | `[]` | 菜单项列表 |
| `SelectedItem` | `NavigationItem \| null` | `null` | 选中项 |
| `PaneDisplayMode` | `"Auto" \| "Left" \| "Top" \| "LeftCompact" \| "LeftMinimal"` | `"Left"` | 面板显示模式 |
| `IsPaneOpen` | `boolean` | `true` | 面板是否展开 |
| `Header` | `string` | `""` | 页面标题 |
| `AlwaysShowHeader` | `boolean` | `true` | 是否始终显示标题 |
| `IsBackButtonVisible` | `boolean` | `true` | 是否显示返回按钮 |
| `IsSettingsVisible` | `boolean` | `true` | 是否显示设置入口 |

**事件：** `@ItemInvoked`, `@BackRequested`, `@PaneToggleRequested`

```vue
<NavigationView
  :MenuItems="menuItems"
  v-model:SelectedItem="currentPage"
  :IsPaneOpen="paneOpen"
  @ItemInvoked="onNavigate">
  <template #content>
    <!-- 页面内容区域 -->
    <TextBlock Text="内容区域" />
  </template>
</NavigationView>
```

#### `<Pivot>`

选项卡导航。

| 属性 | 类型 | 说明 |
|------|------|------|
| `SelectedIndex` | `number` | 选中索引（支持 v-model） |

```vue
<Pivot v-model:SelectedIndex="tabIndex">
  <PivotItem Header="首页">
    <TextBlock Text="首页内容" />
  </PivotItem>
  <PivotItem Header="设置">
    <TextBlock Text="设置内容" />
  </PivotItem>
</Pivot>
```

#### `<PivotItem>`

Pivot 选项卡项。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Header` | `object \| string` | 选项卡标题 |

#### `<SelectorBar>`

选择器栏（水平选项条）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Items` | `SelectorBarItem[]` | 选项列表 |
| `SelectedItem` | `SelectorBarItem` | 选中项 |

#### `<BreadcrumbBar>`

面包屑导航。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `BreadcrumbItem[]` | 数据源 |

#### `<PipsPager>`

分页指示器（同上进度类）。

---

### 集合控件

#### `<ListView>`

列表视图。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `any[]` | 数据源 |
| `SelectedItem` | `any` | 选中项 |
| `SelectionMode` | `"Single" \| "Multiple" \| "Extended" \| "None"` | 选择模式 |
| `IsItemClickEnabled` | `boolean` | 是否启用项点击 |

```vue
<ListView :ItemsSource="items" v-model:SelectedItem="selectedItem" />
```

#### `<GridView>`

网格视图，同 ListView 类似但以网格布局。

#### `<FlipView>`

翻转视图（轮播）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `any[]` | 数据源 |
| `SelectedIndex` | `number` | 当前索引 |

#### `<ItemsView>`

简化的项视图。

#### `<ItemsRepeater>`

列表重复器。

#### `<TreeView>`

树形视图。

| 属性 | 类型 | 说明 |
|------|------|------|
| `ItemsSource` | `TreeNode[]` | 树节点数据 |

---

### 滚动控件

#### `<ScrollViewer>`

滚动容器。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `HorizontalScrollMode` | `"Auto" \| "Enabled" \| "Disabled"` | `"Enabled"` | 水平滚动模式 |
| `VerticalScrollMode` | `"Auto" \| "Enabled" \| "Disabled"` | `"Enabled"` | 垂直滚动模式 |
| `HorizontalScrollBarVisibility` | `"Auto" \| "Visible" \| "Hidden"` | `"Auto"` | 水平滚动条可见性 |
| `VerticalScrollBarVisibility` | `"Auto" \| "Visible" \| "Hidden"` | `"Auto"` | 垂直滚动条可见性 |
| `ZoomMode` | `"Disabled" \| "Enabled"` | `"Disabled"` | 缩放模式 |

```vue
<ScrollViewer VerticalScrollMode="Auto" VerticalScrollBarVisibility="Auto">
  <StackPanel Spacing="8">
    <TextBlock v-for="item in longList" :key="item" :Text="item" />
  </StackPanel>
</ScrollViewer>
```

#### `<ScrollView>`

简化滚动容器。

#### `<ScrollBar>`

独立滚动条。

#### `<AnnotatedScrollBar>`

带标注的滚动条。

#### `<HorizontalScrollContainer>`

水平滚动容器。

#### `<PullToRefresh>`

下拉刷新触发器。

#### `<RefreshContainer>`

刷新容器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `IsRefreshing` | `boolean` | 是否正在刷新 |

#### `<RefreshVisualizer>`

刷新可视化指示器。

---

### 媒体控件

#### `<Image>`

图片显示。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `Source` | `string` | `""` | 图片 URL |
| `Stretch` | `"None" \| "Fill" \| "Uniform" \| "UniformToFill"` | `"Uniform"` | 拉伸模式 |
| `Width` / `Height` | `string` | `""` | 尺寸 |

```vue
<Image Source="https://example.com/photo.jpg" Width="400" />
```

#### `<MediaPlayerElement>`

媒体播放器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Source` | `string` | 媒体 URL |
| `AutoPlay` | `boolean` | 是否自动播放 |
| `IsFullWindow` | `boolean` | 是否全屏 |

#### `<CaptureElement>`

摄像头预览元素。

#### `<PersonPicture>`

人物头像。

| 属性 | 类型 | 说明 |
|------|------|------|
| `DisplayName` | `string` | 显示名称（用于取首字母） |
| `ProfilePicture` | `string` | 头像图片 URL |
| `Initials` | `string` | 自定义首字母 |

```vue
<PersonPicture DisplayName="张三" />
```

#### `<AnimatedVisualPlayer>`

动画播放器（Lottie）。

#### `<ParallaxView>`

视差滚动效果。

#### `<FontIcon>`

字体图标。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Glyph` | `string` | 图标字符 |
| `FontSize` | `number` | 图标大小 |

#### `<SymbolIcon>`

符号图标（Segoe Fluent Icons）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Symbol` | `string` | 符号名称 |

---

### 日期/时间控件

#### `<DatePicker>`

日期选择器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Date` | `Date` | 选中日期（支持 v-model） |
| `MinYear` | `number` | 最小年份 |
| `MaxYear` | `number` | 最大年份 |
| `Header` | `string` | 标题 |

```vue
<DatePicker v-model:Date="birthDate" Header="出生日期" />
```

#### `<TimePicker>`

时间选择器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Time` | `string` | 选中时间（支持 v-model） |
| `Header` | `string` | 标题 |

#### `<CalendarDatePicker>`

日历日期选择器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Date` | `Date` | 选中日期 |
| `PlaceholderText` | `string` | 占位提示 |

#### `<CalendarView>`

日历视图。

| 属性 | 类型 | 说明 |
|------|------|------|
| `SelectedDate` | `Date` | 选中日期 |

---

### 菜单/命令栏

#### `<MenuBar>`

菜单栏。

```vue
<MenuBar>
  <MenuItem Text="文件">
    <MenuFlyoutItem Text="新建" />
    <MenuFlyoutItem Text="打开" />
    <MenuFlyoutItem Text="保存" />
  </MenuItem>
  <MenuItem Text="编辑">
    <MenuFlyoutItem Text="撤销" />
    <MenuFlyoutItem Text="重做" />
  </MenuItem>
</MenuBar>
```

#### `<CommandBar>`

命令栏。

| 属性 | 类型 | 说明 |
|------|------|------|
| `IsOpen` | `boolean` | 是否展开 |
| `IsSticky` | `boolean` | 是否固定 |

#### `<SplitView>`

分割视图面板。

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `IsPaneOpen` | `boolean` | `false` | 面板是否打开 |
| `PanePlacement` | `"Left" \| "Right"` | `"Left"` | 面板位置 |
| `DisplayMode` | `"Overlay" \| "Inline" \| "CompactOverlay" \| "CompactInline"` | `"Overlay"` | 显示模式 |
| `OpenPaneLength` | `number` | `320` | 面板展开宽度 |
| `CompactPaneLength` | `number` | `48` | 面板紧凑宽度 |

---

### 其他控件

#### `<Expander>`

可折叠展开面板。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Header` | `string` | 标题文本 |
| `Description` | `string` | 描述文本 |
| `IsExpanded` | `boolean` | 是否展开（支持 v-model） |

**XAML 子属性：** `<Expander.Header>`, `<Expander.Content>`, `<Expander.Description>`, `<Expander.HeaderIcon>`, `<Expander.HeaderControls>`

```vue
<Expander Header="高级设置" Description="更多配置选项" v-model:IsExpanded="showAdvanced">
  <StackPanel Spacing="8" Padding="16">
    <ToggleSwitch Header="开发者模式" />
    <Slider Header="超时时间" Minimum="10" Maximum="300" />
  </StackPanel>
</Expander>
```

#### `<SwipeControl>`

滑动操作控件（类似 iOS 滑动操作）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `LeftItems` / `RightItems` / `TopItems` / `BottomItems` | `SwipeItems` | 各方向的滑动操作项 |

#### `<SettingsCard>`

设置卡片。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Header` | `string` | 标题 |
| `Description` | `string` | 描述 |

#### `<SemanticZoom>`

语义缩放视图。

#### `<SwitchPresenter>`

状态切换呈现器。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Value` | `string \| number \| boolean` | 当前状态值 |

#### `<TitleBar>`

窗口标题栏（对应 WinUI `TitleBar`）。

| 属性 | 类型 | 说明 |
|------|------|------|
| `Title` | `string` | 标题 |
| `Subtitle` | `string` | 副标题 |
| `IsBackButtonVisible` | `boolean` | 是否显示返回按钮 |
| `IsBackButtonEnabled` | `boolean` | 返回按钮是否可用 |
| `IsPaneToggleButtonVisible` | `boolean` | 是否显示面板切换按钮 |

#### `<Case>`

SwitchPresenter 的条件分支。

#### `<PageHeader>`

页面标题组件。

#### `<TypographyRow>`

排版行示例。

#### `<ControlExample>`

控件示例容器（用于展示控件代码和示例）。

**XAML 子属性：** `<ControlExample.Example>`, `<ControlExample.Output>`, `<ControlExample.Options>`

---

### 运行时工具函数

库也导出了底层运行时函数，供进阶使用：

| 导出名 | 来源 | 说明 |
|--------|------|------|
| `resolveXamlValue` | xamlRuntime | 解析 XAML 绑定值 |
| `resolveXamlHandler` | xamlRuntime | 解析 XAML 事件处理器 |
| `updateXamlBinding` | xamlRuntime | 更新 XAML 绑定 |
| `normalizeXamlVNode` | xamlRuntime | 规范化 XAML VNode |
| `xamlScopeKey` / `xamlNameScopeKey` | xamlRuntime | XAML 作用域注入 key |
| `cssLength` | layout | CSS 长度值转换 |
| `xamlThickness` | layout | XAML Thickness 转 CSS padding/margin |
| `alignment` | layout | XAML 对齐转 CSS |
| `boolValue` | layout | 布尔值解析 |
| `attachedValue` | layout | 附加属性值获取 |
| `createI18n` | i18n | 创建国际化实例 |
| `useI18n` | i18n | 组件内获取 i18n |
| `XamlUICommand` | XamlUICommand | XAML 命令基类 |
| `StandardUICommand` | StandardUICommand | 标准 XAML 命令 |

---

## 开发指南

### 本地开发（Gallery 模式）

```bash
npm install
npm run dev        # 启动 Gallery 开发服务器
```

### 构建库

```bash
npm run build:lib        # 完整构建（含类型检查）
npm run build:lib:fast   # 快速构建（跳过类型检查）
```

构建产物输出到 `dist/` 目录：

```
dist/
├── winuionweb.es.js        # ESM 格式
├── winuionweb.umd.cjs      # UMD 格式
├── winuionweb.iife.js      # IIFE 格式（CDN 使用）
├── winuionweb.css          # 样式文件
├── index.d.ts              # TypeScript 类型声明
└── fonts/                  # 字体文件
```

### 发布到 npm

```bash
# 构建库
npm run build:lib

# 发布
npm publish
```

---

## 构建产物

| 产物 | 格式 | 使用场景 |
|------|------|---------|
| `winuionweb.es.js` | ES Module | 现代打包工具（Vite, Webpack, Rollup） |
| `winuionweb.umd.cjs` | UMD / CommonJS | Node.js 环境、Webpack 传统配置 |
| `winuionweb.iife.js` | IIFE | `<script>` 标签直接引入 |
| `winuionweb.css` | CSS | 主题样式变量 |

---

## License

MIT
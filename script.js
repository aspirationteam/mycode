// 格式化数字显示
function formatNumber(num) {
  return new Intl.NumberFormat('zh-CN').format(Number(num).toFixed(2));
}

// 验证输入值
function validateInput(revenue, cost, refundRate, targetMarginRate) {
  if (revenue <= 0) {
      alert('请输入有效的销售收入！');
      return false;
  }
  if (cost < 0) {
      alert('成本不能为负数！');
      return false;
  }
  if (refundRate < 0 || refundRate > 100) {
      alert('退款率必须在0-100之间！');
      return false;
  }
  if (targetMarginRate < 0 || targetMarginRate > 100) {
      alert('目标毛利率必须在0-100之间！');
      return false;
  }
  return true;
}

// 主计算函数
function calculateMargins() {
  // 获取输入值
  const revenue = parseFloat(document.getElementById('revenue').value) || 0;
  const cost = parseFloat(document.getElementById('cost').value) || 0;
  const refundRate = parseFloat(document.getElementById('refundRate').value) || 0;
  const targetMarginRate = parseFloat(document.getElementById('targetMarginRate').value) || 0;

  // 验证输入
  if (!validateInput(revenue, cost, refundRate, targetMarginRate)) {
      return;
  }

  // 原始毛利率计算
  const originalMarginRate = ((revenue - cost) / revenue) * 100;

  // 方法一：调整收入法
  const adjustedRevenue = revenue * (1 - refundRate/100);
  const adjustedProfit = adjustedRevenue - cost;
  const adjustedMarginRate = (adjustedProfit / adjustedRevenue) * 100;

  // 方法二：利润扣减法
  const refundAmount = revenue * (refundRate/100);
  const originalProfit = revenue - cost;
  const deductedProfit = originalProfit - refundAmount;
  const deductedMarginRate = (deductedProfit / revenue) * 100;

  // 反推销售额
  if (targetMarginRate > 0) {
      const requiredRevenue = (cost / (1 - targetMarginRate / 100)).toFixed(2);
      document.getElementById('requiredRevenue').innerText = `所需销售额: ${requiredRevenue}元`;
  }

  // 更新显示
  updateDisplay({
      originalMarginRate,
      adjustedRevenue,
      adjustedProfit,
      adjustedMarginRate,
      refundAmount,
      deductedProfit,
      deductedMarginRate
  });
}

// 更新显示结果
function updateDisplay(results) {
  // 显示结果区域
  document.getElementById('results').classList.remove('hidden');
  
  // 更新原始毛利率
  document.getElementById('originalMargin').textContent = `${formatNumber(results.originalMarginRate)}%`;
  
  // 更新方法一结果
  document.getElementById('adjustedRevenue').textContent = `${formatNumber(results.adjustedRevenue)}元`;
  document.getElementById('adjustedProfit').textContent = `${formatNumber(results.adjustedProfit)}元`;
  document.getElementById('adjustedMarginRate').textContent = `${formatNumber(results.adjustedMarginRate)}%`;
  
  // 更新方法二结果
  document.getElementById('refundAmount').textContent = `${formatNumber(results.refundAmount)}元`;
  document.getElementById('deductedProfit').textContent = `${formatNumber(results.deductedProfit)}元`;
  document.getElementById('deductedMarginRate').textContent = `${formatNumber(results.deductedMarginRate)}%`;
}
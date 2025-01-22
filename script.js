// 格式化数字显示
function formatNumber(num) {
  return new Intl.NumberFormat('zh-CN').format(Number(num).toFixed(2));
}

// 验证输入值
function validateInput(revenue, cost, refundRate, marginRate) {
  if (revenue < 0) {
      alert('销售收入不能为负数！');
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
  if (marginRate < 0 || marginRate > 100) {
      alert('毛利率必须在0-100之间！');
      return false;
  }
  return true;
}

// 主计算函数
const calculateMargins = (changedInputId) => {
  // 获取输入值
  const revenue = parseFloat(document.getElementById('revenue').value) || 0;
  const cost = parseFloat(document.getElementById('cost').value) || 0;
  const refundRate = parseFloat(document.getElementById('refundRate').value) || 0;
  const marginRate = parseFloat(document.getElementById('marginRate').value) || 0;

  // 验证输入
  if (!validateInput(revenue, cost, refundRate, marginRate)) {
      return;
  }

  // 计算调整后的收入
  const adjustedRevenue = revenue * (1 - refundRate/100);

  // 根据改变的输入框来更新其他值
  switch(changedInputId) {
      case 'revenue':
          if (revenue > 0 && cost > 0) {
              // 根据收入和成本计算毛利率
              const calculatedMargin = ((adjustedRevenue - cost) / adjustedRevenue) * 100;
              document.getElementById('marginRate').value = calculatedMargin.toFixed(2);
          } else if (revenue > 0 && marginRate > 0) {
              // 根据收入和毛利率计算成本
              const calculatedCost = adjustedRevenue * (1 - marginRate/100);
              document.getElementById('cost').value = calculatedCost.toFixed(2);
          }
          break;
          
      case 'cost':
          if (adjustedRevenue > 0) {
              // 根据成本和调整后收入计算毛利率
              const calculatedMargin = ((adjustedRevenue - cost) / adjustedRevenue) * 100;
              document.getElementById('marginRate').value = calculatedMargin.toFixed(2);
          }
          break;
          
      case 'marginRate':
          if (marginRate >= 0 && marginRate <= 100) {
              if (adjustedRevenue > 0) {
                  // 根据毛利率和调整后收入计算成本
                  const calculatedCost = adjustedRevenue * (1 - marginRate/100);
                  document.getElementById('cost').value = calculatedCost.toFixed(2);
              } else if (cost > 0) {
                  // 根据毛利率和成本计算原始收入
                  const calculatedRevenue = cost / (1 - marginRate/100);
                  document.getElementById('revenue').value = (calculatedRevenue / (1 - refundRate/100)).toFixed(2);
              }
          }
          break;
          
      case 'refundRate':
          if (adjustedRevenue > 0 && cost > 0) {
              // 只更新毛利率，不改变成本
              const calculatedMargin = ((adjustedRevenue - cost) / adjustedRevenue) * 100;
              document.getElementById('marginRate').value = calculatedMargin.toFixed(2);
          }
          break;
  }

  // 重新获取最终值用于显示
  const finalRevenue = parseFloat(document.getElementById('revenue').value) || 0;
  const finalCost = parseFloat(document.getElementById('cost').value) || 0;
  const finalAdjustedRevenue = finalRevenue * (1 - refundRate/100);
  const finalAdjustedProfit = finalAdjustedRevenue - finalCost;
  const finalMarginRate = finalAdjustedRevenue > 0 ? (finalAdjustedProfit / finalAdjustedRevenue) * 100 : 0;

  // 更新显示
  updateDisplay({
      adjustedRevenue: finalAdjustedRevenue,
      adjustedProfit: finalAdjustedProfit,
      adjustedMarginRate: finalMarginRate
  });
}

// 更新显示结果
function updateDisplay(results) {
  // 显示结果区域
  document.getElementById('results').classList.remove('hidden');
  
  // 更新结果
  document.getElementById('adjustedRevenue').textContent = `${formatNumber(results.adjustedRevenue)}元`;
  document.getElementById('adjustedProfit').textContent = `${formatNumber(results.adjustedProfit)}元`;
  document.getElementById('adjustedMarginRate').textContent = `${formatNumber(results.adjustedMarginRate)}%`;
}

// 添加输入事件监听器
function addInputListeners() {
    const inputs = ['revenue', 'cost', 'refundRate', 'marginRate'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', () => calculateMargins(id));
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    addInputListeners();
});
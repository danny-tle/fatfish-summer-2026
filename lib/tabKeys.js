// arrow / home / end handling for a role="tablist". put it on the tablist's onKeyDown.
// moves focus to the next tab and clicks it, so selection follows focus.
export function onTabListKeyDown(e) {
  const tabs = Array.from(e.currentTarget.querySelectorAll('[role="tab"]'));
  const i = tabs.indexOf(document.activeElement);
  if (i === -1) return;

  let next;
  if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
  else if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === "Home") next = 0;
  else if (e.key === "End") next = tabs.length - 1;
  else return;

  e.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}

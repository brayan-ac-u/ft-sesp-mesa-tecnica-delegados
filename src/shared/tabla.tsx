import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { BusquedaInput } from './buscador';
import { CustomModal } from './modal';
import Lottie from 'lottie-react';
import logo from '../assets/logo.png';
import '../styles/tabla.css';
import noData from '../assets/animations/noData.json';
import noInfo from '../assets/animations/noInfo.json';
import {
    FaSort,
    FaSortUp,
    FaSortDown,
    FaCheckCircle,
    FaRegCircle
} from 'react-icons/fa';

interface SemaphoreRule {
    min?: number;
    max?: number;
    backgroundColor: string;
    color: string;
}

interface Column {
    key: string;
    label: string;
    hasModal?: boolean;
    renderComponent?: (row: Record<string, any>) => React.ReactNode;
    semaphoreRules?: SemaphoreRule[];
}

interface TableProps {
    columns: Column[];
    data: Record<string, any>[];
    renderModalContent?: (
        row: Record<string, any>,
        column: Column,
        onHide: () => void
    ) => React.ReactNode;
    subtitle: string;
    items: string;
    extraInput?: React.ReactNode;
    dateColumnKey?: string;
    enableColumnSearch?: boolean;
    enableRowSelection?: boolean;
    onSelectionChange?: (selected: string[]) => void;
    externalModalOpen?: boolean;
    initialModalRegistro?: string;
    initialModalColumnKey?: string;
}

const normalizeText = (text: string) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const getSemaphoreStyle = (
    value: number,
    rules: SemaphoreRule[]
): React.CSSProperties => {
    const rule = rules.find(r => {
        const gte = r.min == null || value >= r.min;
        const lte = r.max == null || value <= r.max;
        return gte && lte;
    });
    return rule
        ? { backgroundColor: rule.backgroundColor, color: rule.color }
        : {};
};

export const BootstrapTable: React.FC<TableProps> = ({
    columns,
    data,
    renderModalContent,
    subtitle,
    items,
    extraInput,
    dateColumnKey,
    enableColumnSearch = false,
    enableRowSelection = false,
    onSelectionChange,
    externalModalOpen = false,
    initialModalRegistro,
    initialModalColumnKey,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [columnSearch, setColumnSearch] = useState<{ [k: string]: string }>({});
    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: 'asc' | 'desc' | null;
    }>({ key: null, direction: null });

    const [visibleData, setVisibleData] = useState(15);
    const [hasMoreData, setHasMoreData] = useState(data.length > 15);
    const [showMessage, setShowMessage] = useState(false);
    const [modalData, setModalData] = useState<{ row: any; column: Column } | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [fixedCategory, setFixedCategory] = useState<string | null>(null);
    const lastSelectedIndexRef = useRef<number | null>(null);
    const tableRef = useRef<HTMLDivElement | null>(null);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        onSelectionChange?.(selectedIds);
    }, [selectedIds]);

    useEffect(() => {
        if (!enableRowSelection) return;
        const onClickOutside = (e: MouseEvent) => {
            if (showModal || externalModalOpen) return;
            if (tableRef.current?.contains(e.target as Node)) return;
            setSelectedIds([]);
            setFixedCategory(null);
            lastSelectedIndexRef.current = null;
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !showModal && !externalModalOpen) {
                setSelectedIds([]);
                setFixedCategory(null);
                lastSelectedIndexRef.current = null;
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onClickOutside);
            document.removeEventListener('keydown', onEsc);
        };
    }, [enableRowSelection, showModal, externalModalOpen]);

    // Al montar (o cambiar props), si vienen estas props, abrimos el modal
    useEffect(() => {
        if (initialModalRegistro && initialModalColumnKey) {
            const row = data.find(r => r.registro === initialModalRegistro);
            const column = columns.find(c => c.key === initialModalColumnKey);
            if (row && column) {
                setModalData({ row, column });
                setShowModal(true);
            }
        }
    }, [initialModalRegistro, initialModalColumnKey, data, columns]);

    const filteredByColumn = data.filter(row =>
        columns.every(col => {
            const term = columnSearch[col.key];
            if (enableColumnSearch && term) {
                return String(row[col.key] || '').toLowerCase().includes(term.toLowerCase());
            }
            return true;
        })
    );

    const isColSearchActive = Object.values(columnSearch).some(v => v.trim() !== '');

    const filteredGlobal = data
        .slice()
        .sort((a, b) =>
            dateColumnKey
                ? new Date(b[dateColumnKey]).getTime() - new Date(a[dateColumnKey]).getTime()
                : 0
        )
        .filter(row =>
            isColSearchActive
                ? true
                : columns.some(col =>
                    normalizeText(String(row[col.key] || '')).includes(normalizeText(searchTerm))
                )
        );

    const displayedData = isColSearchActive ? filteredByColumn : filteredGlobal;

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const sortedData = [...displayedData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const va = a[sortConfig.key], vb = b[sortConfig.key];
        if (typeof va === 'number' && typeof vb === 'number') {
            return sortConfig.direction === 'asc' ? va - vb : vb - va;
        }
        if (typeof va === 'string' && typeof vb === 'string') {
            return sortConfig.direction === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return 0;
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMoreData) {
            setVisibleData(v => {
                const nxt = v + 5;
                if (nxt >= sortedData.length) setHasMoreData(false);
                return Math.min(nxt, sortedData.length);
            });
        }
    };

    const openModal = (row: any, column: Column) => {
        setModalData({ row, column });
        setShowModal(true);
    };

    const toggleId = (id: string, idx: number) => {
        const row = sortedData[idx];
        const already = selectedIds.includes(id);
        if (!already && fixedCategory && row.premesaType !== fixedCategory) return;

        let next: string[] = [];
        if (already) {
            next = selectedIds.filter(x => x !== id);
        } else {
            next = [...selectedIds, id];
        }
        setSelectedIds(next);
        if (next.length === 0) {
            setFixedCategory(null);
        } else if (!already && selectedIds.length === 0) {
            setFixedCategory(row.premesaType);
        }
    };

    const handleRowSelect = (e: React.MouseEvent, idx: number) => {
        e.stopPropagation();
        const row = sortedData[idx];
        const id = row.registro as string;
        const disabled =
            enableRowSelection &&
            fixedCategory != null &&
            row.premesaType !== fixedCategory;
        if (disabled) return;

        const { ctrlKey, metaKey, shiftKey } = e;
        let next: string[] = [];

        if (shiftKey && lastSelectedIndexRef.current != null) {
            const start = lastSelectedIndexRef.current, end = idx;
            const [lo, hi] = start < end ? [start, end] : [end, start];
            next = sortedData
                .slice(lo, hi + 1)
                .filter(r => !fixedCategory || r.premesaType === fixedCategory)
                .map(r => r.registro);
            next = Array.from(new Set([...selectedIds, ...next]));
        } else if (ctrlKey || metaKey) {
            if (selectedIds.includes(id)) {
                next = selectedIds.filter(x => x !== id);
            } else {
                next = [...selectedIds, id];
            }
        } else {
            next = [id];
        }

        setSelectedIds(next);
        if (next.length === 0) {
            setFixedCategory(null);
        } else if (selectedIds.length === 0 && next.length > 0) {
            setFixedCategory(sortedData[idx].premesaType);
        }
        lastSelectedIndexRef.current = idx;
    };

    useEffect(() => {
        setShowMessage(data.length < 1);
        setVisibleData(15);
        setHasMoreData(data.length > 15);
    }, [searchTerm, columnSearch, data.length]);

    return (
        <div ref={tableRef}>
            <div className="unp-row">
                <div className="title-container">
                    <div className="logo-subtitle-container">
                        <div className="red-section">1</div>
                        <img className="imgLogo" src={logo} alt="logo" />
                    </div>
                    <div className="subtitle-container">
                        <span className="subtitle-logo">{subtitle}</span>
                        <span className="items">{items}</span>
                    </div>
                </div>

                {data.length > 0 && (
                    <div
                        className="inputs-container"
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'center',
                            justifyContent: enableColumnSearch ? 'flex-end' : 'flex-start'
                        }}
                    >
                        {extraInput && <div style={{ display: 'inline-flex', gap: '0.5rem' }}>{extraInput}</div>}
                        {!enableColumnSearch && (
                            <div style={{ flex: 1 }}>
                                <BusquedaInput onSearch={setSearchTerm} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showMessage ? (
                <div className="animation-container">
                    <Lottie animationData={noData} loop />
                    <span className="lottie">No existen solicitudes pendientes por tramitar</span>
                </div>
            ) : searchTerm && filteredGlobal.length === 0 ? (
                <div className="animation-container">
                    <Lottie animationData={noInfo} loop />
                    <span className="lottie">No se encontró registro con el criterio de búsqueda definido</span>
                </div>
            ) : (
                <div className="table_container">
                    <div className="table-scroll" onScroll={handleScroll}>
                        <Table striped hover style={{ userSelect: 'none' }}>
                            <thead>
                                <tr>
                                    {enableRowSelection && <th style={{ width: 36 }} />}
                                    {columns.map((col, i) => (
                                        <th
                                            key={i}
                                            onClick={() => enableColumnSearch && handleSort(col.key)}
                                            style={{ cursor: enableColumnSearch ? 'pointer' : 'default' }}
                                        >
                                            {col.label}{' '}
                                            {enableColumnSearch && sortConfig.key === col.key ? (
                                                sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />
                                            ) : enableColumnSearch ? (
                                                <FaSort />
                                            ) : null}
                                        </th>
                                    ))}
                                </tr>

                                {enableColumnSearch && (
                                    <tr>
                                        {enableRowSelection && <th />}
                                        {columns.map((col, i) => (
                                            <th key={i}>
                                                <Form.Group className="mx-1 position-relative">
                                                    <Form.Control
                                                        size="sm"
                                                        placeholder={`Buscar ${col.label}`}
                                                        value={columnSearch[col.key] || ''}
                                                        onChange={e =>
                                                            setColumnSearch(cs => ({ ...cs, [col.key]: e.target.value }))
                                                        }
                                                    />
                                                    {columnSearch[col.key] && (
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="position-absolute end-0 top-50 translate-middle-y me-2 p-0"
                                                            onClick={() =>
                                                                setColumnSearch(cs => ({ ...cs, [col.key]: '' }))
                                                            }
                                                            style={{ textDecoration: 'none', color: 'gray' }}
                                                        >
                                                            ✖
                                                        </Button>
                                                    )}
                                                </Form.Group>
                                            </th>
                                        ))}
                                    </tr>
                                )}
                            </thead>

                            <tbody>
                                {sortedData.slice(0, visibleData).map((row, idx) => {
                                    const disabled =
                                        enableRowSelection &&
                                        fixedCategory != null &&
                                        row.premesaType !== fixedCategory;
                                    const isSelected = selectedIds.includes(row.registro);

                                    return (
                                        <tr
                                            key={row.registro}
                                            onClick={
                                                enableRowSelection && !disabled
                                                    ? e => handleRowSelect(e, idx)
                                                    : undefined
                                            }
                                            className={enableRowSelection && isSelected ? 'row-selected' : ''}
                                            style={disabled && !isSelected ? { opacity: 0.5 } : undefined}
                                        >
                                            {enableRowSelection && (
                                                <td
                                                    className="selection-cell"
                                                    style={{
                                                        width: 36,
                                                        textAlign: 'center',
                                                        padding: 4,
                                                        cursor: disabled ? 'not-allowed' : 'pointer'
                                                    }}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        if (!disabled) {
                                                            toggleId(row.registro as string, idx);
                                                        }
                                                    }}
                                                >
                                                    {isSelected
                                                        ? <FaCheckCircle size={18} />
                                                        : <FaRegCircle size={18} />
                                                    }
                                                </td>
                                            )}

                                            {columns.map((col, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    onClick={
                                                        col.hasModal
                                                            ? e => { e.stopPropagation(); openModal(row, col); }
                                                            : undefined
                                                    }
                                                    style={{ cursor: col.hasModal ? 'pointer' : 'default' }}
                                                    className={col.hasModal ? 'cell-with-modal' : ''}
                                                >
                                                    {col.semaphoreRules && typeof row[col.key] === 'number' ? (
                                                        <div
                                                            style={{
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: '50%',
                                                                ...getSemaphoreStyle(row[col.key], col.semaphoreRules)
                                                            }}
                                                        >
                                                            {row[col.key]}
                                                        </div>
                                                    ) : col.renderComponent ? (
                                                        col.renderComponent(row)
                                                    ) : (
                                                        row[col.key]
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>

                    <div className="footer-table-container">
                        <div className="data-unp">
                            {currentYear} • Unidad Nacional de Protección — UNP
                        </div>
                        <div className="data-count">
                            Mostrando {Math.min(visibleData, sortedData.length)} de {sortedData.length} elementos
                        </div>
                    </div>
                </div>
            )}

            {modalData && renderModalContent && (
                <CustomModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    title={modalData.column.label}
                >
                    {renderModalContent(
                        modalData.row,
                        modalData.column,
                        () => setShowModal(false)
                    )}
                </CustomModal>
            )}
        </div>
    );
};
